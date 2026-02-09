import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getMessage } from "../controller/message.controller";

const route=Router()

route.get('/chat/:chatId',protectRoute,getMessage)
export default route;

