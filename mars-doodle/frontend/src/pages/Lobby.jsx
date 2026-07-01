import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../socket/socket";

export default function Lobby() {
    const [room, setRoom] = useState(null);
    const navigate = useNavigate();

    const roomCode = localStorage.getItem("roomCode");
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        loadRoom();

        socket.emit("join-room", roomCode);

        socket.on("player-joined", () => {
            loadRoom();
        });

        socket.on("game-started", () => {
            navigate("/game");
        });

        return () => {
            socket.off("player-joined");
            socket.off("game-started");
        };
    }, []);

    const loadRoom = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/room/${roomCode}`
            );

            setRoom(res.data);

        } catch (err) {
            console.log(err);
        }
    };

    if (!room) return <h2>Loading...</h2>;

    const startGame = async () => {
        try {
            await axios.post(
                "http://localhost:5000/api/room/start",
                {
                    roomCode
                },
                {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token")
                    }
                }
            );

        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h1>Lobby</h1>

            <h2>Room: {room.roomCode}</h2>

            <h3>Players</h3>

            {room.players.map((player) => (
                <p key={player.user._id}>
                    {player.user.username}
                </p>
            ))}

            {room.host === user.id && (
                <button onClick={startGame}>
                    Start Game
                </button>
            )}
        </div>
    );
}