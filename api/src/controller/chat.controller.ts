import type { AuthRequest } from "../middleware/auth.middleware"
import type { Response,NextFunction } from "express"
import { Chat } from "../models/Chat.Model"
export const getChats=async(req:AuthRequest,res:Response,next:NextFunction)=>{
    try {
        const userId=req.userId
        
      const chats=await Chat.find({participants:userId}).populate('participants','name email avatar').populate('lastMessage').sort({lastMessageAt:-1})

      const formattedChats=chats.map(chat=>{
        // when we implment the group chat we need to change the logic
        const otherparticipants=chat.participants.find((p)=>p.toString()!==userId)
        return{
            _id:chat._id,
            participant:otherparticipants,
            lastMessage:chat.lastMessage,
            createdAt:chat.createdAt,

        }
      })

      res.json(formattedChats)
    } catch (error) {
        res.status(500)
        next(error)
    }
}


export const getOrCreateChat=async(req:AuthRequest,res:Response,next:NextFunction)=>{
    try {
        const userId=req.userId
        const {participantId}=req.params
        let chat=await Chat.findOne({
            participants:{$all:[userId,participantId]}
        }).populate('participants','name email avatar').populate('lastMessage')
        if(!chat){
            const newChat=new Chat({
                participants:[userId,participantId]
            })
            await newChat.save()
            chat=await newChat.populate('participants','name email avatar')
        }
        const otherparticipants=chat.participants.find((p)=>p.toString()!==userId)
        res.json({
            _id:chat._id,
            participant:otherparticipants ??null,
            lastMessage:chat.lastMessage,
            createdAt:chat.createdAt,
        })
        
    } catch (error) {
        res.status(500)
        next(error)
    }
}