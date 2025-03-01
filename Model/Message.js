const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({

    senderEmail: String,
    receiverEmail: String,
    // senderId:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"user"

    // },
    // receiverId:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"user"

    // },
    message:{
        type:String,
        required:true
    },
    timestamp: { type: Date, default: Date.now }
})

const Message = mongoose.model("Message",messageSchema)

module.exports = Message;