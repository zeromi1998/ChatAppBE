const http = require("http");
const express = require("express");
const socket = require("socket.io");
const authRouter = require("./routes/authRoute");
const homeRouter = require("./routes/homeRoute");
const userRouter = require("./routes/userRoute");
const userChat = require("./controller/chatController");
const mongoose = require("mongoose");
const cors = require("cors");
const CookieParser = require("cookie-parser");
const app = express();

const server = http.createServer(app);
const io = socket(server,{cors: {
  origi:"https://chat-app-gules-phi.vercel.app/",
  // origin: "http://localhost:5173",  // Allow the React app's URL
  methods: ["GET", "POST"],
},
});
app.use(express.json());
app.use(CookieParser());
app.use(cors());




const dbUri =
  "mongodb+srv://chatappmongo:ChatApp2024@mongochatclient.yxyab.mongodb.net/?retryWrites=true&w=majority&appName=MongoChatClient";

mongoose
  .connect(dbUri)
  .then(() => {
    server.listen(8000, () => {
      console.log("The app is running on port 8000");
    });
  })
  .catch((error) => {
    console.log("this is connection not working", error);
  });

app.get("/home", function (req, res) {
  res.sendfile("index.html");
});

userChat.chatController(io);

 // { email: socketId }

// Socket.IO Connection
// io.on('connection', (socket) => {
//     console.log(`User connected: ${socket.id}`);

//     // Handle user registration
//     socket.on('register', async (email) => {
//         try {
//             // const user = await User.findOneAndUpdate(
//             //     { email },
//             //     { $setOnInsert: { email } },
//             //     { upsert: true, new: true }
//             // );

//             onlineUsers.set(email, socket.id); // Map email to socketId
//             console.log(`${email} registered with Socket ID: ${socket.id}`,onlineUsers);
//             socket.emit('registered', `Welcome, ${email}!`);
//         } catch (err) {
//             console.error('Error during registration:', err);
//             socket.emit('error', 'Registration failed. Try again.');
//         }
//     });

//     // Handle message sending
//     socket.on('sendMessage', async (data) => {
//         const { receiverEmail, message } = data;

//         // Get sender's email from the onlineUsers map

//         const senderEmail = [...onlineUsers.entries()].find(([, id]) => id === socket.id)?.[0];
//         console.log("this is endmsg data",data,onlineUsers,senderEmail);
        
//         if (!senderEmail) {
//             socket.emit('error', 'You are not registered.');
//             return;
//         }

//         // Save the message
//         const newMessage = new Message({
//             senderEmail,
//             receiverEmail,
//             message,
//         });
//         console.log("this is modelcheck",newMessage)
//         await newMessage.save();

//         // Send the message to the receiver if online
//         const receiverSocketId = onlineUsers.get(receiverEmail);
//         console.log("this send mesaga check",receiverEmail,receiverSocketId);
//         if (receiverSocketId) {
//             io.to(receiverSocketId).emit('message', {
//                 from: senderEmail,
//                 message,
//             });
//         } else {
//             console.log(`User with email ${receiverEmail} is offline.`);
//         }
//     });

//     // Fetch chat messages
//     socket.on('fetchMessages', async (chatWithEmail) => {
//         console.log(" this is fetch msg check",chatWithEmail)
//         const senderEmail = [...onlineUsers.entries()].find(([, id]) => id === socket.id)?.[0];
//         if (!senderEmail) {
//             socket.emit('error', 'You are not registered.');
//             return;
//         }

//         const messages = await Message.find({
//             $or: [
//                 { senderEmail, receiverEmail: chatWithEmail },
//                 { senderEmail: chatWithEmail, receiverEmail: senderEmail },
//             ],
//         }).sort('timestamp');

//         socket.emit('messageHistory', { chatWithEmail, messages });
//     });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         const user = [...onlineUsers.entries()].find(([, id]) => id === socket.id);
//         if (user) {
//             console.log(`User disconnected: ${user[0]} (Socket ID: ${socket.id})`);
//             onlineUsers.delete(user[0]);
//         }
//     });
// });
// app.use(chatRouter);
app.use(authRouter);
app.use(homeRouter);
app.use(userRouter);

