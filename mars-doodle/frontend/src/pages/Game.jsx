import { useEffect } from "react";
import socket from "../socket/socket";
import Canvas from "../components/Canvas";

export default function Game() {

    useEffect(() => {

        socket.emit("join-room", "A5DC1J");

    }, []);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh"
            }}
        >
            <Canvas />
        </div>
    );
}