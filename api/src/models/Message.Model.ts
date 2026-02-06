import mongoose, { type Document } from "mongoose";

export interface Message extends Document{
    chat:mongoose.Types.ObjectId;
    sender:mongoose.Types.ObjectId;
    text:string;
    createdAt:Date;
    updatedAt:Date;
}

const MessageSchema=new mongoose.Schema<Message>({
    chat: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat",
        required:true,
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    text:{
        type:String,
        required:true,
         trim:true
    }
    
},{timestamps:true})

MessageSchema.index({chat:1,createdAt:1})//oldest one first 
export const Message=mongoose.model<Message>("Message",MessageSchema);