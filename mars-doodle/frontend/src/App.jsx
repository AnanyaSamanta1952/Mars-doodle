import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import socket from "./socket/socket";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";

function App() {
  useEffect(() => {

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    return () => {
      socket.off("connect");
    };

  }, []);
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route 
          path="/lobby" 
          element={<Lobby />} 
        />
        <Route 
          path="/game" 
          element={<Game />} 
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;