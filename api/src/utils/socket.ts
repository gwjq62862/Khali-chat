import { verifyToken } from "@clerk/express";
import { Server as HttpServer } from "http";
import { Socket, Server as SocketIOServer } from "socket.io";
import { User } from "../models/User.Model";
import { Chat } from "../models/Chat.Model";
import { Message } from "../models/Message.Model";

interface SocketWithUserId extends Socket {
    userId: string;
}

export const onlineUsers: Map<string, string> = new Map();
export const initializeSocket = (httpServer: HttpServer) => {
    const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:8081",
        process.env.FRONT_END_URL as string,
    ];

    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: allowedOrigins,
        },
    });

    // Check if the user is authenticated
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error("Authentication error: No token provided"));
            }

            const session = await verifyToken(token, {
                secretKey: process.env.CLERK_SECRET_KEY as string,
            });

            const clerkId = session.sub;
            const user = await User.findOne({ clerkId });

            if (!user) {
                return next(new Error("User not found"));
            }


            (socket as SocketWithUserId).userId = user._id.toString();
            next();

        } catch (error) {

            next(new Error("Authentication error: Invalid token"));
        }
    });



    io.on("connection", (socket) => {
        const userId = (socket as SocketWithUserId).userId;

        socket.emit("online-users", { userIds: Array.from(onlineUsers.keys()) });
        onlineUsers.set(userId, socket.id);
        socket.broadcast.emit("user-online", { userId });

        socket.join(`user:${userId}`);


        socket.on('join-chat', async (chatId: string) => {
            try {
                const chat = await Chat.findOne({
                    _id: chatId,
                    participants: userId
                });
                if (!chat) {
                    return socket.emit("error", { message: "You are not a participant." });
                }
                socket.join(`chat:${chatId}`);
            } catch (error) {
                socket.emit("error", { message: "Failed to join chat." });
            }
        });

        socket.on('leave-chat', (chatid: string) => {
            socket.leave(`chat:${chatid}`);
        });


        socket.on("send-message", async (data: { chatId: string, text: string }) => {
            const { chatId, text } = data;
            try {
                const chat = await Chat.findOne({
                    _id: chatId,
                    participants: userId
                });

                if (!chat) {
                    return socket.emit("error", { message: "You are not a participant." });
                }

                const message = await Message.create({
                    chat: chatId,
                    sender: userId,
                    text
                });

                chat.lastMessage = message._id;
                chat.lastMessageAt = new Date();
                await chat.save();

                await message.populate("sender", "name email avatar");


             
                io.to(`chat:${chatId}`).emit("new-message", message);


                for (const participantId of chat.participants) {

                    if (participantId.toString() === userId) continue;

                    io.to(`user:${participantId}`).emit('message-notification', {
                        chatId,
                        message: {
                            _id: message._id,
                            text: message.text,
                            sender: message.sender,
                            createdAt: message.createdAt
                        }
                    });
                }
            } catch (error) {
                socket.emit("error", { message: "Failed to send message." });
            }
        });

        //TODO: Implement typing indicator
        socket.on('typing', (data: { chatId: string }) => {

        })
        socket.on("disconnect", () => {
            onlineUsers.delete(userId);
            socket.broadcast.emit("user-offline", { userId });
        });


    });
    return io;
}