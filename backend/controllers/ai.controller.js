const express=require("express");

const chatWithAI=async(req,res)=>{
    const {message}=req.body;

    if(!message){
        return res.status(400).json({ message: "Message is required" });
    }

    try {
        const dummyReplies = {
        "how to reverse a string": "You can use JavaScript's `split`, `reverse`, and `join` methods.\n\n```js\nconst reversed = str.split('').reverse().join('');\n```",
        "what is a promise": "A Promise is an object representing the eventual completion or failure of an async operation.\n\n```js\nnew Promise((resolve, reject) => {\n  // async work\n});\n```",
        "default": "I'm a demo AI assistant. Ask me about JavaScript, React, or coding best practices!"
        };

        const matched = Object.keys(dummyReplies).find((key) =>
        message.toLowerCase().includes(key)
        );

        const reply = dummyReplies[matched] || dummyReplies["default"];        

        res.status(200).json({ reply });
    } catch (error) {
        console.error("AI Chat Error:", error.response?.data || error.message);
        res.status(500).json({ message: "AI service failed" });
    }
}

module.exports={chatWithAI};