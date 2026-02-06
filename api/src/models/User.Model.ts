import mongoose, { type Document, Schema } from "mongoose";


export interface User extends Document{
    clerkId:string;
    name:string;
    email:string;
    avatar?:string;
    createdAt:Date;
    updatedAt:Date;
}

export const UserSchema=new Schema<User>({
    clerkId:{type:String,required:true,unique:true},
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,unique:true,lowercase:true,trim:true},
    avatar:{type:String,default:""},
    
},{timestamps:true})


export const User=mongoose.model<User>("User",UserSchema);