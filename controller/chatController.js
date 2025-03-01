const socket = require("socket.io");

const Message = require("../Model/Message");
module.exports.chatController = (io) => {
  console.log("this is user controller called for socket");
  const onlineUsers = new Map();
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user registration
    socket.on("register", async (email) => {
      try {
        // const user = await User.findOneAndUpdate(
        //     { email },
        //     { $setOnInsert: { email } },
        //     { upsert: true, new: true }
        // );
        console.log(`${email} registered with Socket ID 111: ${socket.id}`);

        onlineUsers.set(email, socket.id); // Map email to socketId
        console.log(
          `${email} registered with Socket ID: ${socket.id}`,
          onlineUsers
        );
        socket.emit("registered", `Welcome, ${email}!`);
      } catch (err) {
        console.error("Error during registration:", err);
        socket.emit("error", "Registration failed. Try again.");
      }
    });

    // Handle message sending
    socket.on("sendMessage", async (data) => {
      const { receiverEmail, message } = data;

      // Get sender's email from the onlineUsers map
      let senderEmail;
      for (const [email, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          senderEmail = email;
          break;
        }
      }

      // const senderEmail = [...onlineUsers.entries()].find(([, id]) => id === socket.id)?.[0];
      console.log("this is endmsg data", data, onlineUsers, senderEmail,socket.id);

      if (!senderEmail) {
        socket.emit("error", "You are not registered.");
        return;
      }

      // Save the message
      const newMessage = new Message({
        senderEmail,
        receiverEmail,
        message,
      });
      console.log("this is modelcheck", newMessage);
      await newMessage.save();

      // Send the message to the receiver if online
      const receiverSocketId = onlineUsers.get(receiverEmail);
      console.log("this send mesaga check", receiverEmail, receiverSocketId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("message", {
          from: senderEmail,
          message,
        });
      } else {
        console.log(`User with email ${receiverEmail} is offline.`);
      }
    });

    // Fetch chat messages
    socket.on("fetchMessages", async (chatWithEmail) => {
      console.log(" this is fetch msg check", chatWithEmail);
      const senderEmail = [...onlineUsers.entries()].find(
        ([, id]) => id === socket.id
      )?.[0];
      if (!senderEmail) {
        socket.emit("error", "You are not registered.");
        return;
      }

      const messages = await Message.find({
        $or: [
          { senderEmail, receiverEmail: chatWithEmail },
          { senderEmail: chatWithEmail, receiverEmail: senderEmail },
        ],
      }).sort("timestamp");

      socket.emit("messageHistory", { chatWithEmail, messages });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      const user = [...onlineUsers.entries()].find(
        ([, id]) => id === socket.id
      );
      if (user) {
        console.log(`User disconnected: ${user[0]} (Socket ID: ${socket.id})`);
        onlineUsers.delete(user[0]);
      }
    });
  });
};
