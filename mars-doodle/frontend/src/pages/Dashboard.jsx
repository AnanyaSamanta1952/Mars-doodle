import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/dashboard.css";

export default function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [roomCode, setRoomCode] = useState("");
    const createRoom = async () => {
        try {
            const res = await api.post("/room/create");
            localStorage.setItem(
                "roomCode",
                res.data.roomCode
            );
            navigate("/lobby");
        } catch (err) {
            alert(err.response?.data?.message);
        }
    };

    const joinRoom = async () => {
        try {
            await api.post("/room/join", {
                roomCode
            });
            localStorage.setItem(
                "roomCode",
                roomCode
            );
            navigate("/lobby");
        } catch (err) {
            alert(err.response?.data?.message);
        }
    };

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (

        <div className="dashboard">
            <div className="dashboard-card">
                <h1>🚀 Mars Doodle</h1>
                <p>
                    Welcome,
                    <strong> {user.username}</strong>
                </p>

                <button onClick={createRoom}>
                    Create Room
                </button>

                <hr
                    style={{
                        margin:"25px 0"
                    }}
                />

                <input
                    placeholder="Enter Room Code"
                    value={roomCode}
                    onChange={(e)=>setRoomCode(e.target.value.toUpperCase())}
                />

                <button onClick={joinRoom}>
                    Join Room
                </button>

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}