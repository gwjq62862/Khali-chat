import mongoose, { type Document } from "mongoose";



export interface Chat extends Document {
    participants: mongoose.Types.ObjectId[];
    lastMessage?: mongoose.Types.ObjectId;
    lastMessageAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
const ChatSchema = new mongoose.Schema<Chat>({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
    lastMessageAt: { type: Date, default: Date.now }
}, { timestamps: true })

export const Chat=mongoose.model<Chat>("Chat",ChatSchema);