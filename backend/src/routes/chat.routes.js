import { Router } from "express";
import chatController from "../controller/chat.controller.js";
import authUser from "../middleware/auth.middleware.js";

const chatRouter = Router()


chatRouter.post("/message",authUser,chatController.sendMessage)
chatRouter.get("/:chatId/messages",authUser,chatController.getMessages)
chatRouter.get("/mychats",authUser,chatController.getChats)
chatRouter.delete("/:chatId/delete",authUser,chatController.deleteChat)


export default chatRouter