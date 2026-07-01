import { useEffect } from "react";
import socket from "../socket/socket";

export default function Lobby() {

    useEffect(() => {
        const roomCode = localStorage.getItem("roomCode");
        socket.emit("join-room", roomCode);
        socket.on("player-joined", (data) => {
            console.log(data);
        });
        return () => {
            socket.off("player-joined");
        };
    }, []);

    return (
        <div>
            <h1>Lobby</h1>
        </div>
    );
}