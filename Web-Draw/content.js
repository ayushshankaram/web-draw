let activeTool = null;
let selectedColor = "red";
let drawnAnnotations = [];
let undoHistory = [];
let isActiveDrawing = false;
let initialX, initialY;
let drawingCanvas, context;

// Listener for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "pen":
      enableDrawingTool();
      break;
    case "highlight-btn":
      selectedColor = message.color || "yellow";
      enableHighlighting();
      break;
    case "undo-btn":
      revertLastAction();
      break;
    case "save-btn":
      saveDrawnAnnotations();
      break;
  }
});

function enableDrawingTool() {
  activeTool = "pen";
  if (!drawingCanvas) {
    setupCanvas();
  }
}

function removeCanvas() {
  if (drawingCanvas) {
    drawingCanvas.remove();
    drawingCanvas.removeEventListener("mousedown", initiateDrawing);
    drawingCanvas.removeEventListener("mousemove", performDrawing);
    drawingCanvas.removeEventListener("mouseup", finishDrawing);
    drawingCanvas.removeEventListener("mouseout", finishDrawing);
    drawingCanvas = null;
    context = null;
    drawnAnnotations = [];
  }
}

function enableHighlighting() {
  removeCanvas();
  activeTool = "highlight";
  document.addEventListener("mouseup", applyHighlight);
}

function setupCanvas() {
  drawingCanvas = document.createElement("canvas");
  drawingCanvas.style.position = "absolute";
  drawingCanvas.style.top = "0";
  drawingCanvas.style.left = "0";
  drawingCanvas.width = window.innerWidth;
  drawingCanvas.height = window.innerHeight;
  document.body.appendChild(drawingCanvas);
  context = drawingCanvas.getContext("2d");

  drawingCanvas.addEventListener("mousedown", initiateDrawing);
  drawingCanvas.addEventListener("mousemove", performDrawing);
  drawingCanvas.addEventListener("mouseup", finishDrawing);
  drawingCanvas.addEventListener("mouseout", finishDrawing);

  loadSavedAnnotations();
  restoreToolState();
}

function initiateDrawing(event) {
  if (activeTool !== "pen") return;
  isActiveDrawing = true;
  initialX = event.clientX;
  initialY = event.clientY;
  currentPath = [{ x: initialX, y: initialY }];
}

function performDrawing(event) {
  if (!isActiveDrawing) return;

  context.strokeStyle = selectedColor;
  context.lineWidth = 2;
  context.lineCap = "round";
  context.globalAlpha = 1.0;

  context.beginPath();
  context.moveTo(initialX, initialY);
  context.lineTo(event.clientX, event.clientY);
  context.stroke();

  drawnAnnotations.push({
    tool: "pen",
    color: selectedColor,
    startX: initialX,
    startY: initialY,
    endX: event.clientX,
    endY: event.clientY,
  });

  initialX = event.clientX;
  initialY = event.clientY;
  currentPath.push({ x: initialX, y: initialY });
}

function finishDrawing() {
  if (!isActiveDrawing) return;
  isActiveDrawing = false;
  if (currentPath.length > 1) {
    drawnAnnotations.push({ tool: activeTool, color: selectedColor, path: currentPath });
  }
}

function saveDrawnAnnotations() {
  chrome.storage.local.set({ annotations: drawnAnnotations }, () => {
    if (chrome.runtime.lastError) {
      console.error("Failed to save annotations:", chrome.runtime.lastError);
      sendResponse({ status: "error", message: "Failed to save annotations" });
    } else {
      console.log("Annotations saved successfully");
      sendResponse({ status: "success", message: "Annotations saved successfully" });
    }
  });
}

function loadSavedAnnotations() {
  chrome.storage.local.get("annotations", (data) => {
    if (chrome.runtime.lastError) {
      console.error("Failed to load annotations:", chrome.runtime.lastError);
    } else {
      drawnAnnotations = data.annotations || [];
      repaintCanvas();
    }
  });
}

function repaintCanvas() {
  if (context) {
    context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    drawnAnnotations.forEach((annotation) => {
      if (annotation.tool === "pen") {
        context.strokeStyle = annotation.color;
        context.lineWidth = 2;
        context.globalAlpha = 1.0;
        context.beginPath();
        context.moveTo(annotation.startX, annotation.startY);
        context.lineTo(annotation.endX, annotation.endY);
        context.stroke();
      } else if (annotation.tool === "highlight") {
        context.fillStyle = annotation.color;
        context.fillRect(
          annotation.rect.left,
          annotation.rect.top,
          annotation.rect.width,
          annotation.rect.height
        );
      }
    });
  }
}

function applyHighlight() {
  if (activeTool !== "highlight") return;
  const selection = window.getSelection();
  if (!selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    const highlightSpan = document.createElement("span");
    highlightSpan.style.backgroundColor = selectedColor;
    highlightSpan.id = "highlight-" + Date.now();
    highlightSpan.appendChild(range.extractContents());
    range.insertNode(highlightSpan);

    selection.removeAllRanges();

    drawnAnnotations.push({
      tool: "highlight",
      html: highlightSpan.outerHTML,
      parentXPath: generateXPath(highlightSpan.parentNode),
      id: highlightSpan.id,
    });
  }
}

function generateXPath(element) {
  if (element.id) return 'id("' + element.id + '")';
  if (element === document.body) return element.tagName;
  let index = 0;
  const siblings = element.parentNode.childNodes;
  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i];
    if (sibling === element)
      return generateXPath(element.parentNode) + "/" + element.tagName + "[" + (index + 1) + "]";
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) index++;
  }
}

function revertLastAction() {
  if (drawnAnnotations.length > 0) {
    const lastAction = drawnAnnotations.pop();
    undoHistory.push(lastAction);
    repaintCanvas();
    if (lastAction.tool === "highlight") {
      const parentElement = document.evaluate(
        lastAction.parentXPath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      if (parentElement) {
        const highlightSpans = parentElement.querySelectorAll(`span[id="${lastAction.id}"]`);
        highlightSpans.forEach((span) => {
          const textNode = document.createTextNode(span.textContent);
          span.parentNode.replaceChild(textNode, span);
        });
      }
    }
  }
}
