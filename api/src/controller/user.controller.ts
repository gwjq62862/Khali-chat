import type { AuthRequest } from "../middleware/auth.middleware"
import type { NextFunction, Response } from "express"
import { User } from "../models/User.Model"
export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {

    try {
        const userId = req.userId
        const users = await User.find({ _id: { $ne: userId } }).select("name email avatar").limit(50)

        res.json(users)


    } catch (error) {
        res.status(500)
        next(error)
    }


}