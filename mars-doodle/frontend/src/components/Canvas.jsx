import { useEffect, useRef, useState } from "react";
import socket from "../socket/socket";

export default function Canvas({
    isDrawer,
    color,
    brushSize,
    eraser
}) {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctx.strokeStyle = eraser ? "#ffffff" : color;
        socket.on("drawing", ({ x0, y0, x1, y1 }) => {
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        });
        socket.on("canvas-cleared", () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
        return () => {
            socket.off("drawing");
            socket.off("canvas-cleared");
        };
    }, [color, brushSize, eraser]);

    const startDrawing = (e) => {
        if (!isDrawer) return;
        setDrawing(true);

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        canvas.lastX = (e.clientX - rect.left) * scaleX;
        canvas.lastY = (e.clientY - rect.top) * scaleY;
    };

    const stopDrawing = () => {
        setDrawing(false);

        const canvas = canvasRef.current;
        canvas.lastX = undefined;
        canvas.lastY = undefined;
    };

    const draw = (e) => {
        if (!drawing) return;
        if (!drawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        if (canvas.lastX === undefined) {
            canvas.lastX = x;
            canvas.lastY = y;
            return;
        }
        ctx.lineWidth = brushSize;
        ctx.strokeStyle = eraser ? "#ffffff" : color;
        ctx.beginPath();
        ctx.moveTo(canvas.lastX, canvas.lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        socket.emit("draw", {
            roomCode: localStorage.getItem("roomCode"),
            x0: canvas.lastX,
            y0: canvas.lastY,
            x1: x,
            y1: y
        });
        canvas.lastX = x;
        canvas.lastY = y;
    };
    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={550}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onMouseMove={draw}
            style={{
                border: "3px solid #333",
                borderRadius: "12px",
                background: "#fff",
                boxShadow: "0 5px 20px rgba(0,0,0,.15)"
            }}
        />
    );
}