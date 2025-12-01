import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { sendMatrices } from "../api";


export default function MatrixInputPage() {
    const [matrixA, setMatrixA] = useState([[""]]);
    const [matrixB, setMatrixB] = useState([[""]]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");


    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleMatrixChange = (setter, i, j, value) => {
        setter(prev => {
            const copy = prev.map(row => [...row]);
            if (value.trim() === "") copy[i][j] = "";
            else {
                const num = Number(value);
                if (!isNaN(num)) copy[i][j] = num;
            }
            return copy;
        });
    };

    const addRowCol = (setter, type) => {
        setter(prev => {
            if (type === "row") return [...prev, Array(prev[0].length).fill("")];
            if (type === "col") return prev.map(row => [...row, ""]);
            return prev;
        });
    };


    const handleSubmit = async e => {
        e.preventDefault();
        if (!isFileUploaded && matrixA[0].length !== matrixB.length) {
            setMessage("Matrix dimensions mismatch for multiplication");
            setMessageType("error");
            return;
        }
        setLoading(true);``
        setMessage("");
        try {
            const res = await sendMatrices(matrixA, matrixB);
            setResult(res.result);
            setMessage("Task successfully submitted!");
            setMessageType("success");
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setMessage(err.response.data.detail);
            } else {
                setMessage("You have already reached the limit of tasks in progress");
            }
            setMessageType("error");
        }
        setLoading(false);
    };


    const handleUploadJSON = e => {
        const file = e.target.files[0];
        if (!file) return;

        setIsFileUploaded(true);

        const reader = new FileReader();
        reader.onload = event => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.matrixA) setMatrixA(data.matrixA);
                if (data.matrixB) setMatrixB(data.matrixB);
            } catch {
                alert("Incorrect JSON format");
                setIsFileUploaded(false);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="page-home">
            <Navbar />
            <div
                className="map-card"
                style={{
                    maxWidth: "900px",
                    margin: "30px auto",
                    background: "#141414",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                    color: "#f5f5f5",
                    border: "1px solid var(--accent)",
                }}
            >
                <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Matrix Input</h2>

                {message && (
                    <div style={{
                        marginTop: "20px",
                        padding: "10px",
                        borderRadius: "5px",
                        backgroundColor: messageType === "success" ? "green" : "red",
                        color: "#fff",
                        textAlign: "center"
                    }}>
                        {message}
                    </div>
                )}

                {/* Показуємо тільки якщо файл не завантажений */}
                {!isFileUploaded && (
                    <div style={{ display: "flex", gap: "50px", justifyContent: "center", flexWrap: "wrap" }}>
                        {/* MATRIX A */}
                        <div>
                            <h3>Matrix A</h3>
                            {matrixA.map((row, i) => (
                                <div key={i} style={{ display: "flex", gap: "5px", marginBottom: "5px" }}>
                                    {row.map((val, j) => (
                                        <input
                                            key={j}
                                            value={val}
                                            onChange={e => handleMatrixChange(setMatrixA, i, j, e.target.value)}
                                            style={{
                                                width: "60px",
                                                height: "50px",
                                                textAlign: "center",
                                                borderRadius: "4px",
                                                border: "1px solid #333",
                                                background: "#222",
                                                color: "#f5f5f5",
                                            }}
                                        />
                                    ))}
                                </div>
                            ))}
                            <div style={{ marginTop: "10px" }}>
                                <button className="btn" onClick={() => addRowCol(setMatrixA, "row")} style={{ marginRight: "5px" }}>
                                    + Row
                                </button>
                                <button className="btn" onClick={() => addRowCol(setMatrixA, "col")}>
                                    + Column
                                </button>
                            </div>
                        </div>

                        {/* MATRIX B */}
                        <div>
                            <h3>Matrix B</h3>
                            {matrixB.map((row, i) => (
                                <div key={i} style={{ display: "flex", gap: "5px", marginBottom: "5px" }}>
                                    {row.map((val, j) => (
                                        <input
                                            key={j}
                                            value={val}
                                            onChange={e => handleMatrixChange(setMatrixB, i, j, e.target.value)}
                                            style={{
                                                width: "60px",
                                                height: "50px",
                                                textAlign: "center",
                                                borderRadius: "4px",
                                                border: "1px solid #333",
                                                background: "#222",
                                                color: "#f5f5f5",
                                            }}
                                        />
                                    ))}
                                </div>
                            ))}
                            <div style={{ marginTop: "10px" }}>
                                <button className="btn" onClick={() => addRowCol(setMatrixB, "row")} style={{ marginRight: "5px" }}>
                                    + Row
                                </button>
                                <button className="btn" onClick={() => addRowCol(setMatrixB, "col")}>
                                    + Column
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: "20px", display: "flex", gap: "20px", alignItems: "center" }}>
                    <button className="btn" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Processing…" : "Multiply"}
                    </button>
                    <input type="file" accept=".json" onChange={handleUploadJSON} style={{ color: "#f5f5f5" }} />
                </div>

                {result && (
                    <div style={{ marginTop: "30px", textAlign: "center" }}>
                        <h3>Result:</h3>
                        {result.length <= 50 ? (
                            result.map((row, i) => (
                                <div key={i} style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
                                    {row.map((val, j) => (
                                        <div
                                            key={j}
                                            style={{
                                                padding: "10px",
                                                border: "1px solid #ddd",
                                                borderRadius: "4px",
                                                background: "#222",
                                            }}
                                        >
                                            {val}
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <div>
                                <p>Matrix too large to display. Showing JSON result:</p>
                                <pre
                                    style={{
                                        textAlign: "left",
                                        background: "#222",
                                        padding: "10px",
                                        borderRadius: "4px",
                                        maxHeight: "500px",
                                        overflow: "auto",
                                    }}
                                >
                                    {JSON.stringify(result, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
