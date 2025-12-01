import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMyTasks } from "../api";

export default function MatrixResultPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTask() {
            try {
                const tasks = await getMyTasks();
                const t = tasks.find((task) => task.id === Number(id));
                setTask(t || null);
            } catch (err) {
                console.error("Failed to load task:", err);
            } finally {
                setLoading(false);
            }
        }
        loadTask();
    }, [id]);

    const downloadJSON = () => {
        if (!task?.output_data) return;
        const blob = new Blob([JSON.stringify(task.output_data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `task_${task.id}_result.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const buttonStyle = {
        background: "gold",
        border: "none",
        padding: "10px 20px",
        borderRadius: "6px",
        color: "#000",
        fontWeight: "bold",
        cursor: "pointer",
        margin: "10px",
    };

    if (loading)
        return (
            <div className="page-home">
                <Navbar />
                <p style={{ textAlign: "center", marginTop: "20px" }}>Loading task...</p>
            </div>
        );

    if (!task)
        return (
            <div className="page-home">
                <Navbar />
                <p style={{ textAlign: "center", marginTop: "20px" }}>Task not found</p>
                <button style={buttonStyle} onClick={() => navigate(-1)}>Back</button>
            </div>
        );

    if (task.status !== "completed")
        return (
            <div className="page-home">
                <Navbar />
                <p style={{ textAlign: "center", marginTop: "20px" }}>
                    Task is {task.status}. Result is not available yet.
                </p>
                <button style={buttonStyle} onClick={() => navigate(-1)}>Back</button>
            </div>
        );

    const resultMatrix = task.output_data?.result || [];
    const totalElements = resultMatrix.reduce((acc, row) => acc + row.length, 0);
    const MAX_ELEMENTS = 50;

    return (
        <div className="page-home">
            <Navbar />
            <div style={{ maxWidth: "800px", margin: "30px auto", textAlign: "center" }}>
                <h2>Result for Task #{task.id}</h2>

                {totalElements <= MAX_ELEMENTS ? (
                    <table style={{ margin: "20px auto", borderCollapse: "collapse" }}>
                        <tbody>
                        {resultMatrix.map((row, i) => (
                            <tr key={i}>
                                {row.map((val, j) => (
                                    <td
                                        key={j}
                                        style={{
                                            border: "1px solid #ddd",
                                            padding: "10px 15px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {val}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <pre
                        style={{
                            textAlign: "left",
                            background: "#141414",
                            color: "#f5f5f5",
                            padding: "15px",
                            borderRadius: "6px",
                            maxHeight: "500px",
                            overflowY: "auto",
                        }}
                    >
                        {JSON.stringify(task.output_data, null, 2)}
                    </pre>
                )}

                <div>
                    <button style={buttonStyle} onClick={() => navigate(-1)}>Back</button>
                    <button style={buttonStyle} onClick={downloadJSON}>Download JSON</button>
                </div>
            </div>
        </div>
    );
}
