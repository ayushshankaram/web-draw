document.getElementById("draw-tool").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "draw-tool" });
  });
});

document.getElementById("highlight-tool").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "highlight-tool" });
  });
});

document.getElementById("save-tool").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "save-tool" });
  });
});

document.getElementById("undo-tool").addEventListener("mousedown", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "undo-tool" });
  });
});

document.getElementById("highlight-tool").addEventListener("click", () => {
  document.getElementById("color-picker").style.display = "flex";
});

document.querySelectorAll(".color-option").forEach((button) => {
  button.addEventListener("click", () => {
    const selectedColor = button.getAttribute("data-color");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "highlight-tool", color: selectedColor });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const highlightTool = document.getElementById("highlight-tool");
  const colorPicker = document.getElementById("color-picker");

  // Show color picker when highlight button is hovered
  highlightTool.addEventListener("mouseover", () => {
    colorPicker.style.display = "block";
  });

  // Hide color picker when mouse leaves the color picker
  colorPicker.addEventListener("mouseleave", () => {
    colorPicker.style.display = "none";
  });
});
