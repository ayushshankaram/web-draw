chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension successfully installed.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveAnnotation") {
    saveAnnotations(message.annotat, message.high, sendResponse);
  } else if (message.action === "loadAnnotations") {
    loadAnnotations(sendResponse);
  }
  return true; // Ensure sendResponse will be called asynchronously
});

function saveAnnotations(annotations, highlights, sendResponse) {
  try {
    chrome.storage.local.set({ annotations: annotations, highlights: highlights }, () => {
      if (chrome.runtime.lastError) {
        console.error("Failed to save annotations:", chrome.runtime.lastError);
        sendResponse({ status: "failure" });
      } else {
        sendResponse({ status: "success" });
      }
    });
  } catch (error) {
    console.error("Error saving annotations:", error);
    sendResponse({ status: "failure" });
  }
}

function loadAnnotations(sendResponse) {
  try {
    chrome.storage.local.get(["annotations", "highlights"], (result) => {
      if (chrome.runtime.lastError) {
        console.error("Failed to load annotations:", chrome.runtime.lastError);
        sendResponse({ annotations: [], highlights: [] });
      } else {
        sendResponse({
          annotations: result.annotations || [],
          highlights: result.highlights || [],
        });
      }
    });
  } catch (error) {
    console.error("Error loading annotations:", error);
    sendResponse({ annotations: [], highlights: [] });
  }
}
