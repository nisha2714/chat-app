import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST"],
	},
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId != "undefined") userSocketMap[userId] = socket.id;

	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// socket.on() is used to listen to the events. can be used both on client and server side
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { app, io, server };


// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:3000"],
//     methods: ["GET", "POST"],
//   },
// });

// const userSocketMap = {}; // {userId: socketId}

// export const getReceiverSocketId = (receiverId) => {
//   return userSocketMap[receiverId];
// };

// io.on("connection", (socket) => {
//   console.log("a user connected", socket.id);

//   const userId = socket.handshake.query.userId;
//   if (userId !== undefined && userId) {
//     userSocketMap[userId] = socket.id;
//   }

//   // Emit online users to all connected clients
//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   // Handle sending messages
//   socket.on("sendMessage", ({ senderId, receiverId, message }) => {
//     const receiverSocketId = getReceiverSocketId(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("receiveMessage", {
//         senderId,
//         message,
//       });
//     } else {
//       console.log("Receiver is not online");
//     }
//   });

//   // Handle user disconnection
//   socket.on("disconnect", () => {
//     console.log("user disconnected", socket.id);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

// export { app, io, server };
