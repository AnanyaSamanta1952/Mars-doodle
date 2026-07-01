const Room = require("../models/Room");
const generateRoomCode = require("../utils/generateRoomCode");

exports.createRoom = async (req, res) => {
    try {
        const room = await Room.create({
            roomCode: generateRoomCode(),
            host: req.user.id,
            players: [
                {
                    user: req.user.id,
                    score: 0,
                    isDrawer: true,
                    isReady: false
                }
            ]
        });
        res.status(201).json(room);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });

    }

};
exports.joinRoom = async (req, res) => {
    try {
        const { roomCode } = req.body;
        const room = await Room.findOne({ roomCode });
        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        // Check if user is already in the room
        const alreadyJoined = room.players.some(
            player => player.user.toString() === req.user.id
        );

        if (alreadyJoined) {
            return res.status(400).json({
                message: "You are already in this room"
            });
        }
        room.players.push({
            user: req.user.id,
            score: 0,
            isDrawer: false,
            isReady: false
        });
        await room.save();
        req.app.get("io").to(roomCode).emit("player-joined");
        res.status(200).json(room);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

exports.getRoom = async (req, res) => {
    try {
        const room = await Room.findOne({
            roomCode: req.params.roomCode
        }).populate("players.user", "username email");

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }
        res.json(room);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

exports.startGame = async (req, res) => {
    try {
        const { roomCode } = req.body;

        const room = await Room.findOne({ roomCode });

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        // Only host can start
        if (room.host.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Only host can start the game"
            });
        }

        room.gameStarted = true;
        await room.save();

        req.app.get("io").to(roomCode).emit("game-started");

        res.json({
            message: "Game started"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};