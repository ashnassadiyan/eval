importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Parse Firebase Configuration from registration URL query parameters
const params = new URLSearchParams(self.location.search);
const firebaseConfig = {
  apiKey: params.get('apiKey') || '',
  authDomain: params.get('authDomain') || '',
  databaseURL: params.get('databaseURL') || '',
  projectId: params.get('projectId') || '',
  storageBucket: params.get('storageBucket') || '',
  messagingSenderId: params.get('messagingSenderId') || '',
  appId: params.get('appId') || '',
  measurementId: params.get('measurementId') || '',
};

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  // Initialize Firebase App in Service Worker
  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging();

  // Handle Background Push Notifications
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background push message:', payload);
    const notificationTitle = payload.notification?.title || payload.data?.title || 'EvalCV.app Notification';
    const notificationOptions = {
      body: payload.notification?.body || payload.data?.body || '',
      icon: '/logo.png',
      data: payload.data,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}
