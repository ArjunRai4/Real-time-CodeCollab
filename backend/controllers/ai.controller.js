const chatWithAI=async(req,res)=>{
    const {message}=req.body;

    if(!message){
        return res.status(400).json({ message: "Message is required" });
    }

    try {
        const aiRes=await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4", // or "gpt-3.5-turbo"
                messages: [
                { role: "system", content: "You are a helpful programming assistant." },
                { role: "user", content: message },
                ],
            },
            {
                headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
                },                
            }
        )

        const reply = aiRes.data.choices[0].message.content;
        res.status(200).json({ reply });
    } catch (error) {
        console.error("AI Chat Error:", error.response?.data || error.message);
        res.status(500).json({ message: "AI service failed" });
    }
}

module.exports={};