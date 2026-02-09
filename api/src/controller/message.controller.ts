import type { AuthRequest } from "../middleware/auth.middleware"
import type { NextFunction, Response } from "express"
import { Chat } from "../models/Chat.Model"
import { Message } from "../models/Message.Model"

export const getMessage=async(req:AuthRequest,res:Response,next:NextFunction)=>{
    try {
        const userId=req.userId
        const {chatId}=req.params

        const chat=await Chat.findOne({_id:chatId,participants:userId})
        if(!chat){
            return res.status(404).json({message:"Chat not found"})
        }
        const message=await Message.find({chat:chatId}).populate("sender","name avatar email").sort({createdAt:1})
        res.status(200).json(message)
    } catch (error) {
        res.status(500)
        next(error)
    }
}