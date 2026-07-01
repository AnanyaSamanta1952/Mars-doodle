import { useEffect, useRef, useState } from "react";

import socket from "../socket/socket";

import Canvas from "../components/Canvas";
import Toolbar from "../components/Toolbar";

export default function Game() {
    const canvasRef = useRef(null);
    const [color, setColor] = useState("#000000");
    const [brushSize, setBrushSize] = useState(3);
    const [eraser, setEraser] = useState(false);
    useEffect(() => {
        const roomCode = localStorage.getItem("roomCode");
        if (roomCode) {
            socket.emit("join-room", roomCode);
        }
    }, []);
    const clearCanvas = () => {
        const canvas = document.querySelector("canvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        socket.emit(
            "clear-canvas",
            localStorage.getItem("roomCode")
        );
    };
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "20px"
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

            <Canvas

                ref={canvasRef}

                color={color}

                brushSize={brushSize}

                eraser={eraser}

            />

        </div>

    );

}