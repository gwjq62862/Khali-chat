import { getAuth, requireAuth } from "@clerk/express";

import type { Request,Response,NextFunction } from "express";
import { User } from "../models/User.Model";
export type AuthRequest=Request&{
    userId?:string;
}
export const protectRoute=[
    requireAuth(),
    async(req:AuthRequest,res:Response,next:NextFunction)=>{
     try {
        const {userId:clerkId}=getAuth(req)
        
        const user=await User.findOne({clerkId})
        if(!user){
            return res.status(404).json({error:'User not found'})
        }
        req.userId=user._id.toString()
        next()
     } catch (error) {
    
        res.status(500)
        next(error)
     }
    }
]