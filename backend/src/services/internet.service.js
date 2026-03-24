import dotenv from "dotenv";
dotenv.config()
import { tavily } from "@tavily/core";

async function internetSearch(prompt) {
    
    const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
    
    const response = await tvly.search(prompt);

    return {message:"result has been searched on web successfully",results:response.results}
}

export default internetSearch