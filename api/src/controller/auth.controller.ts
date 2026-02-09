import { clerkClient, getAuth } from "@clerk/express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { User } from "../models/User.Model";
import type { Response, Request, NextFunction } from 'express'

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500)
        next(error)

    }
}


export const authCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId: clerkId } = getAuth(req)
        if (!clerkId) {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        let user = await User.findOne({ clerkId })
        if (!user) {
            const clerkUser = await clerkClient.users.getUser(clerkId)



            const primaryEmail =
                clerkUser.primaryEmailAddress?.emailAddress ??
                clerkUser.emailAddresses[0]?.emailAddress

            if (!primaryEmail) {
                return res.status(400).json({ error: "Email required" })
            }

            const getName = () => {
                if (clerkUser.fullName) return clerkUser.fullName

                if (primaryEmail) return primaryEmail.split('@')[0]

                return 'User' // Final fallback
            }
            user = await User.create({
                clerkId,
                name: getName(),
                email: primaryEmail,
                avatar: clerkUser.imageUrl || '',
            })
        }
        res.status(201).json(user)

    } catch (error) {
        console.log(error)
        res.status(500)
        next(error)
    }
}
