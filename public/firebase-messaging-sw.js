importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyAjBfaf9NtElOQ1oRGVZbvwfcRSGs3AhlQ",
  authDomain: "foodease-dc29f.firebaseapp.com",
  projectId: "foodease-dc29f",
  storageBucket: "foodease-dc29f.firebasestorage.app",
  messagingSenderId: "1013496471405",
  appId: "1:1013496471405:web:c03bc4cc31f804422f0464",
  measurementId: "G-Q8DGQLG7SB",
};

// Initialize Firebase in the service worker
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized with static config in Service Worker");

  const messaging = firebase.messaging();

  // Handle background messages
  messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.data.title;
    const notificationOptions = {
      body: payload.data.body,
      icon: payload.data.image || "/firebase-logo.png",
    };
    // Show notification in background
    self.registration
      .showNotification(notificationTitle, notificationOptions)
      .then(() => {
        console.log("Notification displayed successfully");
      })
      .catch((err) => {
        console.error("Error showing notification:", err);
      });
  });
}
