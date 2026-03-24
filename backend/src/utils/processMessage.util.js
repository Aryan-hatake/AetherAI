import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import aiService from "../services/ai.service.js";

export async function processMessage( user, message, chatId ) {
    console.log(user, message , chatId)
    let chat, title = null
    let messages, response;

    if (chatId) {

        const userMessage = await messageModel.create({
            chat: chatId,
            content: message,
            role: "user"
        })

        messages = await messageModel.find({
            chat: chatId
        })

        if (messages.length === 1) {
            const invalidChat = await messageModel.findOneAndDelete({
                chat: chatId
            })
            const err = new Error("chatId not found")
            err.status = 404
            return next(err)
        }
        response = await aiService.generateResponse(null, messages)
    }
    else {

        title = await aiService.generateTitle(message)
        chat = await chatModel.create({
            user,
            title
        })

        response = await aiService.generateResponse(message, null)

        const userMessage = await messageModel.create({
            chat: chat?._id,
            content: message,
            role: "user"
        })
    }


    const aiMessage = await messageModel.create({
        chat: chat?._id || chatId,
        content: response,
        role: "ai"
    })

    return {response,title,chat: chatId || chat?._id}
}