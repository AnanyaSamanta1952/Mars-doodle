import { useEffect, useRef, useState } from "react";

import socket from "../socket/socket";

import Canvas from "../components/Canvas";
import Toolbar from "../components/Toolbar";
import axios from "axios";

export default function Game() {
    const canvasRef = useRef(null);
    const [color, setColor] = useState("#000000");
    const [brushSize, setBrushSize] = useState(3);
    const [eraser, setEraser] = useState(false);
    const [isDrawer, setIsDrawer] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [currentWord, setCurrentWord] = useState("");

    useEffect(() => {
        const roomCode = localStorage.getItem("roomCode");
        socket.emit("join-room", roomCode);
        loadGame();
        socket.on("receive-message", (msg) => {
            setMessages(prev => [...prev, msg]);
        });
        return () => {
            socket.off("receive-message");
        };
    }, []);

    const loadGame = async () => {
        try {
            const roomCode = localStorage.getItem("roomCode");
            const user = JSON.parse(localStorage.getItem("user"));
            const res = await axios.get(
                `http://localhost:5000/api/room/${roomCode}`,
                {
                    headers: {
                        Authorization:
                            "Bearer " +
                            localStorage.getItem("token")
                    }
                }
            );

            if (
                res.data.currentDrawer &&
                res.data.currentDrawer._id === user.id
            ) {
                setIsDrawer(true);
            } else {
                setIsDrawer(false);
            }

            setCurrentWord(res.data.currentWord);
        } catch (err) {
            console.log(err);
        }

    };
    const clearCanvas = () => {
        const canvas = document.querySelector("canvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        socket.emit(
            "clear-canvas",
            localStorage.getItem("roomCode")
        );
    };
    const sendMessage = () => {
        if (!message.trim()) return;
        socket.emit("chat-message", {
            roomCode: localStorage.getItem("roomCode"),
            message,
            user: JSON.parse(localStorage.getItem("user")).username
        });
        setMessage("");
    };
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "#f3f4f6",
                padding: "20px"
            }}
        >
            <div
                style={{
                    width: "1300px",
                    background: "#fff",
                    borderRadius: "15px",
                    padding: "25px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
                }}
            >
                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: "10px"
                    }}
                >
                    🚀 Mars Doodle
                </h1>

                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "20px"
                    }}
                >
                    {isDrawer
                        ? `🎨 Draw : ${currentWord}`
                        : `Guess : ${currentWord}`}
                </h2>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "20px"
                    }}
                >
                    <Toolbar
                        color={color}
                        setColor={setColor}
                        brushSize={brushSize}
                        setBrushSize={setBrushSize}
                        eraser={eraser}
                        setEraser={setEraser}
                        clearCanvas={clearCanvas}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        alignItems: "flex-start"
                    }}
                >
                    {/* Canvas */}
                    <div style={{ flex: 3 }}>
                        <Canvas
                            isDrawer={isDrawer}
                            color={color}
                            brushSize={brushSize}
                            eraser={eraser}
                        />
                    </div>

                    {/* Chat */}
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            background: "#fafafa",
                            border: "1px solid #ddd",
                            borderRadius: "12px",
                            padding: "15px",
                            height: "650px"
                        }}
                    >
                        <h3 style={{ marginTop: 0 }}>
                            💬 Chat
                        </h3>

                        <div
                            style={{
                                flex: 1,
                                overflowY: "auto",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "10px",
                                marginBottom: "15px",
                                background: "white"
                            }}
                        >
                            {messages.map((msg, index) => (
                                <p key={index}>
                                    <b>{msg.user}</b>: {msg.text}
                                </p>
                            ))}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: "10px"
                            }}
                        >
                            <input
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                                placeholder="Type your guess..."
                                style={{
                                    flex: 1,
                                    padding: "10px",
                                    borderRadius: "8px",
                                    border: "1px solid #ccc"
                                }}
                            />

                            <button
                                onClick={sendMessage}
                                style={{
                                    padding: "10px 18px",
                                    background: "#4CAF50",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer"
                                }}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}