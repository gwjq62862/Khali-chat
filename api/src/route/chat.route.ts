import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getChats, getOrCreateChat } from "../controller/chat.controller";

const route=Router()
route.use(protectRoute)

route.get('/',getChats)
route.post('/with/:participantId',getOrCreateChat)



export default route;

