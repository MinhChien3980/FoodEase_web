// lib/fpixel.js

// Track a page view event
export const pageViewEvent = () => {
  if (window.fbq) {
    window.fbq("track", "PageView");
  }
};

// Track a custom event
export const customEvent = (name, options = {}) => {
  if (window.fbq) {
    window.fbq("track", name, options);
  }
};
