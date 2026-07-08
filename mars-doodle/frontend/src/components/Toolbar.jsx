export default function Toolbar({
    color,
    setColor,
    brushSize,
    setBrushSize,
    clearCanvas,
    eraser,
    setEraser
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "25px",
                padding: "15px 25px",
                marginBottom: "20px",
                background: "#ffffff",
                borderRadius: "15px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb"
            }}
        >
            {/* Color */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}
            >
                <span style={{ fontWeight: "600" }}>🎨 Color</span>

                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    disabled={eraser}
                    style={{
                        width: "45px",
                        height: "40px",
                        border: "none",
                        cursor: "pointer",
                        background: "transparent"
                    }}
                />
            </div>

            {/* Brush Size */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                }}
            >
                <span style={{ fontWeight: "600" }}>
                    🖌 Size
                </span>

                <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) =>
                        setBrushSize(Number(e.target.value))
                    }
                />

                <span
                    style={{
                        fontWeight: "bold",
                        width: "20px"
                    }}
                >
                    {brushSize}
                </span>
            </div>

            {/* Pen / Eraser */}
            <button
                onClick={() => setEraser(!eraser)}
                style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    border: "none",
                    background: eraser ? "#2563eb" : "#f59e0b",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                {eraser ? "✏️ Pen" : "🧽 Eraser"}
            </button>

            {/* Clear */}
            <button
                onClick={clearCanvas}
                style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#ef4444",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                🗑 Clear
            </button>
        </div>
    );
}