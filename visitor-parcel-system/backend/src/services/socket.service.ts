import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

export let io: Server;

export const initSocket = (server: any) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Allow all for dev
            methods: ["GET", "POST"]
        }
    });

    io.use((socket: Socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("Authentication error"));

        jwt.verify(token, process.env.JWT_SECRET || "secret_key", (err: any, decoded: any) => {
            if (err) return next(new Error("Authentication error"));
            socket.data.user = decoded;
            next();
        });
    });

    io.on("connection", (socket: Socket) => {
        console.log(`User connected: ${socket.data.user.userId}`);

        // Join a room specific to the user
        socket.join(`user_${socket.data.user.userId}`);

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};

export const notifyResident = (residentId: number, type: string, message: string, data: any) => {
    if (io) {
        io.to(`user_${residentId}`).emit("notification", { type, message, data });
    }
};
