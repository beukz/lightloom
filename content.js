// content.js

// Load and apply brightness setting from storage
(async function applyBrightness() {
    const url = new URL(window.location.href);
    const storedData = await chrome.storage.local.get([url.hostname]);
    const brightness = storedData[url.hostname] || 100; // Default 100% (no effect)
    document.documentElement.style.filter = brightness === 100 ? "none" : `brightness(${brightness / 100})`;
  })();
  
  // Inject a full-screen div overlay
  (function injectFullScreenDiv() {
    if (!document.getElementById("brightness-overlay")) {
      const overlayDiv = document.createElement("div");
      overlayDiv.id = "brightness-overlay"; // Assign ID for easier removal
      overlayDiv.style.position = "fixed";
      overlayDiv.style.top = "0";
      overlayDiv.style.left = "0";
      overlayDiv.style.width = "100%";
      overlayDiv.style.height = "100vh";
      overlayDiv.style.backgroundColor = "rgba(0, 0, 0, 0)"; // Fully transparent initially
      overlayDiv.style.pointerEvents = "none"; // Ensures it doesn't block interactions with the page
      overlayDiv.style.zIndex = "9999"; // Ensures overlay is on top of other elements
      document.body.appendChild(overlayDiv);
    }
  })();
  
  // Function to update overlay opacity based on brightness
  function updateOverlayOpacity(brightness) {
    const overlayDiv = document.getElementById("brightness-overlay");
    if (overlayDiv) {
      const opacity = (100 - brightness) / 100; // Invert brightness to calculate opacity
      overlayDiv.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`; // Set background color with opacity
    }
  }
  