import { Server } from "socket.io";

let id = 1;
let connectedCount = 0; // המונה שלנו

export const createSocket = (httpServer) => {
  const io = new Server(httpServer, {});

  io.on("connection", (socket) => {
    // כשמישהו מתחבר - מעלים ב-1 ושולחים לכולם
    connectedCount++;
    io.emit("update_count", connectedCount);

    socket.userId = id++;
    socket.emit("user connected", { userId: socket.userId });

    socket.on("update_user_details", (data) => {
      socket.username = data.username;
      socket.color = data.color;
    });

    socket.on("new message", (newMessage) => {
      io.emit("send message", {
        by: socket.username || socket.userId,
        msg: newMessage,
        color: socket.color || "#000000",
      });
    });

    socket.on("disconnect", () => {
      // כשמישהו מתנתק - מורידים ב-1 ושולחים לכולם
      connectedCount--;
      io.emit("update_count", connectedCount);

      if (socket.username) {
        io.emit("send message", {
          by: "מערכת",
          msg: `המשתמש ${socket.username} עזב את הצ'אט`,
          color: "#888888",
        });
      }
    });
  });
};
