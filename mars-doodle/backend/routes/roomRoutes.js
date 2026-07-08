const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createRoom,
    joinRoom,
    getRoom,
    startGame
} = require("../controllers/roomController");

router.post("/create", authMiddleware, createRoom);
router.post("/join", authMiddleware, joinRoom);
router.get("/:roomCode", authMiddleware, getRoom);
router.post("/start", authMiddleware, startGame);

module.exports = router;