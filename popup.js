// popup.js

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("brightness-slider");
  const resetButton = document.getElementById("reset");

  // Load the current brightness for this URL and set the slider to it
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = new URL(tabs[0].url);
    chrome.storage.local.get([url.hostname], (result) => {
      slider.value = result[url.hostname] !== undefined ? result[url.hostname] : 100; // Default to 100% if not stored
    });
  });

  // Listen for slider input to update brightness in storage and apply it to the page
  slider.addEventListener("input", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = new URL(tabs[0].url);
      const brightness = parseInt(slider.value, 10); // Parse slider value as integer
      chrome.storage.local.set({ [url.hostname]: brightness }, () => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: updateBrightness,
          args: [brightness],
        });

        // Safely call updateOverlayOpacity if defined
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: (brightness) => {
            if (typeof updateOverlayOpacity === 'function') {
              updateOverlayOpacity(brightness); // Call the function if it's defined
            }
          },
          args: [brightness],
        });
      });
    });
  });

  // Reset button functionality: clear stored brightness, reset to 100%, and remove overlay
  resetButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = new URL(tabs[0].url);

      // Clear stored brightness setting for this website
      chrome.storage.local.remove(url.hostname, () => {
        slider.value = 100; // Move slider to 100% position

        // Remove brightness filter and overlay
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: resetToDefault,
        });
      });
    });
  });
});

// Function injected to adjust brightness
function updateBrightness(brightness) {
  const brightnessValue = brightness / 100;
  document.documentElement.style.filter = brightness === 100 ? "none" : `brightness(${brightnessValue})`;
}

// Function injected to reset page to default brightness and remove overlay
function resetToDefault() {
  document.documentElement.style.filter = "none";

  const overlayDiv = document.getElementById("brightness-overlay");
  if (overlayDiv) {
    overlayDiv.remove();
  }
}
