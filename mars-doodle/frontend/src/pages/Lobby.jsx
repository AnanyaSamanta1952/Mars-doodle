import { useEffect } from "react";
import socket from "../socket/socket";

export default function Lobby() {

    useEffect(() => {

        socket.emit("join-room", "A5DC1J");

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