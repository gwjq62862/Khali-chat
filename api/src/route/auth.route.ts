import { Router } from "express";
import { getMe,authCallback } from "../controller/auth.controller";
import { protectRoute } from "../middleware/auth.middleware";

const route=Router()
route.get('/me',protectRoute,getMe)
route.post('/callback',authCallback)
export default route;

