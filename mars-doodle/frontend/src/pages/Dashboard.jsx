import { useEffect } from "react";
import socket from "../socket/socket";

export default function Dashboard() {
    const roomCode = "A5DC1J";
    useEffect(() => {
        socket.emit("join-room", roomCode);
        socket.on("player-joined", (data) => {
            console.log("Player Joined!");
            console.log(data.message);
            console.log(data.socketId);
        });
        return () => {
            socket.off("player-joined");
        };
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Joined Room: {roomCode}</p>
        </div>
    );

}