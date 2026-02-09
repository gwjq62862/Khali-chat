import type { AuthRequest } from "../middleware/auth.middleware"
import type { Response, NextFunction } from "express"
import { Chat } from "../models/Chat.Model"
export const getChats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;


        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID missing" });
        }

        const chats = await Chat.find({ participants: userId })
            .populate('participants', 'name email avatar')
            .populate('lastMessage')
            .sort({ lastMessageAt: -1 });

        const formattedChats = chats.map(chat => {

            const otherParticipant = chat.participants.find(
                (p: any) => p._id?.toString() !== userId.toString()
            );

            return {
                _id: chat._id,
                participant: otherParticipant,
                lastMessage: chat.lastMessage,
                createdAt: chat.createdAt,
            };
        });

        res.json(formattedChats);
    } catch (error) {
        res.status(500);
        next(error);
    }
};


export const getOrCreateChat = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        const { participantId } = req.params;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        let chat = await Chat.findOne({
            participants: { $all: [userId, participantId] }
        }).populate('participants', 'name email avatar'); 

        if (!chat) {
            const newChat = new Chat({
                participants: [userId, participantId]
            });
            await newChat.save();
            chat = await newChat.populate('participants', 'name email avatar');
        }

       
        const otherParticipant = chat.participants.find(
            (p: any) => p._id?.toString() !== userId.toString()
        );

        res.json({
            _id: chat._id,
            participant: otherParticipant ?? null,
            lastMessage: chat.lastMessage,
            createdAt: chat.createdAt,
        });

    } catch (error) {
        res.status(500);
        next(error);
    }
};