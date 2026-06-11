/**
 * Firebase Messaging Service Worker (background push for web).
 *
 * This file MUST live at /public/firebase-messaging-sw.js so the browser
 * can register it as the push event handler.
 *
 * Replace the config values below with your actual Firebase project config,
 * or use a build step to inject them.
 */

/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
});

const messaging = firebase.messaging();

// Background message handler — shown as a system notification
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "NTIGI Notification";
  const options = {
    body: payload.notification?.body || "",
    icon: "/logo.png",
    badge: "/logo.png",
    data: payload.data,
  };

  self.registration.showNotification(title, options);
});

// Open the app when the user clicks the notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification?.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
