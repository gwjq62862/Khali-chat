import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getUsers } from "../controller/user.controller";

const route=Router()
route.get('/',protectRoute,getUsers)
export default route;

