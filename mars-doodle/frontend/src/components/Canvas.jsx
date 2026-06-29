import { useEffect, useRef, useState } from "react";
import socket from "../socket/socket";

export default function Canvas() {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
        socket.on("drawing", ({ x0, y0, x1, y1 }) => {
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        });
        return () => socket.off("drawing");
    }, []);

    const startDrawing = (e) => {
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
        ctx.beginPath();
        ctx.moveTo(canvas.lastX, canvas.lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        socket.emit("draw", {
            roomCode: "A5DC1J",
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
            width={900}
            height={600}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onMouseMove={draw}
            style={{
                border: "2px solid black",
                background: "white"
            }}
        />
    );
}