const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        roomCode: {
            type: String,
            required: true,
            unique: true
        },

        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        players: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },

                score: {
                    type: Number,
                    default: 0
                },

                guessedCorrectly: {
                    type: Boolean,
                    default: false
                },

                isDrawer: {
                    type: Boolean,
                    default: false
                },

                isReady: {
                    type: Boolean,
                    default: false
                },

                joinedAt: {
                    type: Date,
                    default: Date.now
                },

            }
        ],

        gameStarted: {
            type: Boolean,
            default: false
        },

        currentRound: {
            type: Number,
            default: 1
        },
        currentDrawer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        currentWord: {
            type: String,
            default: ""
        },

        roundChanging: {
            type: Boolean,
            default: false
        },
        
        roundEnded: {
            type: Boolean,
            default: false
        },

        drawerIndex: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true
    });

module.exports = mongoose.model("Room", roomSchema);