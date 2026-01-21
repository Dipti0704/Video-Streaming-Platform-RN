# Aniverse - Anime Video Streaming Platform

Welcome to **Aniverse**, a premium video streaming application built with React Native (Expo) and a robust Node.js backend. This platform allows users to stream anime content, interact via comments, and manage their playlists with a secure and seamless experience.

##  Features

###  Secure Authentication (JWT & OAuth)

-   **JWT Implementation**: 
    -   Double-token architecture (Access Token & Refresh Token) for enhanced security.
    -   Auto-refreshing tokens via Axios interceptors.
    -   Secure storage using MMKV (encrypted) on the client.
-   **Email/Password Login**: Standard secure login flow.

###  Video Streaming
-   **HLS Streaming**: Adaptive bitrate streaming for smooth playback on varied network conditions.
-   **Custom Video Player**: Feature-rich player with timestamp comments, quality selection, and gesture controls.

###  Interactive Community
-   **Real-time Comments**: Socket.io integration for instant comment updates.
-   **Timestamped Comments**: Users can comment on specific moments in the video.

##  Tech Stack

### Client (Mobile)
-   **Framework**: React Native (Expo SDK 52)
-   **Navigation**: Expo Router (File-based routing)
-   **State Management**: Zustand
-   **Storage**: React Native MMKV
-   **Video**: `react-native-video`
-   **Networking**: Axios, Socket.io-client

### Backend (Server)
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB (Mongoose)
-   **Authentication**: `jsonwebtoken`, `google-auth-library`
-   **Real-time**: Socket.io

---

##  Screenshots

<!-- Paste your screenshots here -->
![alt text](image-1.png)

---

##  Getting Started

### Prerequisites
-   Node.js (v18+)
-   Expo Go App (on your mobile device)
-   MongoDB Connection URI

### 1. Backend Setup (Server)

Navigate to the server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d
GOOGLE_CLIENT_ID=your_google_web_client_id
```

Start the server:
```bash
npm start
```

### 2. Frontend Setup (Client)

Navigate to the client directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `client` directory:
```env
EXPO_PUBLIC_API_URL=http://<YOUR_PC_IP>:4000
EXPO_PUBLIC_SOCKET_URL=http://<YOUR_PC_IP>:4000
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
```

Start the app:
```bash
npx expo start -c
```

Scan the QR code with **Expo Go** on your Android/iOS device.

##  How to Use
1.  **Login**: Use the Google Sign-In button or enter your credentials.
2.  **Home**: Browse the latest anime collections.
3.  **Watch**: Tap on any anime to start streaming. Use gestures to control volume/brightness.
4.  **Comment**: Engage with the community by posting comments.

---

