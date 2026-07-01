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
                gap: "20px",
                alignItems: "center",
                padding: "10px",
                marginBottom: "15px",
                background: "#f5f5f5",
                borderRadius: "10px",
                border: "1px solid #ddd"
            }}
        >
            {/* Color Picker */}
            <div>
                <label>🎨 Color </label>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    disabled={eraser}
                />
            </div>

            {/* Brush Size */}
            <div>
                <label>🖌 Size </label>
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                />
            </div>

            {/* Eraser */}
            <button
                onClick={() => setEraser(!eraser)}
            >
                {eraser ? "✏️ Pen" : "🧽 Eraser"}
            </button>

            {/* Clear */}
            <button
                onClick={clearCanvas}
            >
                🗑 Clear Canvas
            </button>

        </div>
    );
}