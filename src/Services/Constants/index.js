import io from "socket.io-client";

// Replace this with your actual socket server URL
// const SOCKET_URL = "http://192.168.1.40:8081/";

const SOCKET_URL = "https://d7rn0cepphx14.cloudfront.net";

let socket;

// Function to initialize socket connection
export const connectSocket = () => {
  try {
    socket = io(SOCKET_URL, {
      reconnection: true, // Allow automatic reconnection
      reconnectionAttempts: Infinity, // Unlimited reconnection attempts
    });

    socket.on("connect", () => {
      console.log("Socket connected successfully:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return socket;
  } catch (error) {
    console.error("Error initializing socket:", error);
  }
};

// Function to get the active socket instance
export const getSocket = () => {
  if (!socket) {
    console.error("Socket not connected! Call connectSocket first.");
  }
  return socket;
};

// Function to disconnect the socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("Socket disconnected");
  }
};
