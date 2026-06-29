module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);

        // User joins a socket room
        socket.on("join-room", (roomCode) => {
            socket.join(roomCode);
            console.log(`${socket.id} joined ${roomCode}`);

            // Notify everyone else in the room
            socket.to(roomCode).emit("player-joined", {
                message: "A new player joined the room",
                socketId: socket.id
            });
        });

        socket.on("draw", (data) => {
            socket.to(data.roomCode).emit("drawing", data);
        });

        socket.on("disconnect", () => {
            console.log(`User Disconnected: ${socket.id}`);
        });
    });
};