const Room = require("../models/Room");
const words = require("../utils/words");

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
        socket.on("clear-canvas", (roomCode) => {
            io.to(roomCode).emit("canvas-cleared");
        });

        socket.on("disconnect", () => {
            console.log(`User Disconnected: ${socket.id}`);
        });
        socket.on("chat-message", async (data) => {
            const room = await Room.findOne({
                roomCode: data.roomCode
            });

            if (!room) return;
            if (room.roundEnded) return;

            // Always show the message in chat
            io.to(data.roomCode).emit("receive-message", {
                user: data.user,
                text: data.message
            });

            // Ignore guesses from the drawer
            const drawer = room.currentDrawer.toString();

            if (drawer === data.userId) return;

            // Correct Guess
            if (
                data.message.trim().toLowerCase() ===
                room.currentWord.toLowerCase()
            ) {

                // Give 10 points to guesser
                const player = room.players.find(
                    p => p.user.toString() === data.userId
                );

                if (!player || player.guessedCorrectly) return;

                player.score += 10;
                player.guessedCorrectly = true;

                // Drawer gets 5
                const drawerPlayer = room.players.find(
                    p => p.user.toString() === room.currentDrawer.toString()
                );

                if (drawerPlayer) {
                    drawerPlayer.score += 5;
                }

                // End this round
                room.roundEnded = true;
                await room.save();

                // Show message in chat
                io.to(data.roomCode).emit("receive-message", {
                    user: "🎉",
                    text: `${data.user} guessed the word correctly!`
                });

                // Update scores
                io.to(data.roomCode).emit("correct-guess", {
                    winner: data.user,
                    scores: room.players,
                    word: room.currentWord
                });
                setTimeout(() => {
                    io.to(data.roomCode).emit(
                        "start-next-round"
                    );
                }, 3000);
            }
        });

        socket.on("next-round", async (roomCode) => {

            const room = await Room.findOne({ roomCode });

            if (!room) return;

            // Next drawer
            room.drawerIndex =
                (room.drawerIndex + 1) % room.players.length;

            room.currentDrawer =
                room.players[room.drawerIndex].user;

            // New word
            room.currentWord =
                words[Math.floor(Math.random() * words.length)];

            // Reset round
            room.roundEnded = false;

            // Reset guessedCorrectly
            room.players.forEach(player => {
                player.guessedCorrectly = false;
            });

            await room.save();

            io.to(roomCode).emit("new-round");
        });
    });
};