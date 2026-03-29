const { Server } = require("socket.io");

let io;

function initSocket(server){

  io = new Server(server, {

    cors:{
      origin: process.env.CLIENT_URL,
      credentials:true
    }

  });

  io.on("connection",(socket)=>{

    console.log("socket connected");

    socket.on(
      "join-room",
      (creatorId)=>{

        const room =
          `creator-${creatorId}`;

        socket.join(room);

        console.log(
          "join room:",
          room
        );

      }
    );

  });

  return io;

}

function getIO(){

  if(!io){

    throw new Error(
      "socket.io not initialized"
    );

  }

  return io;

}

module.exports = {

  initSocket,
  getIO

};