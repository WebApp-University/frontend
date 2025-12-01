import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {cancelTask, getMyTasks} from "../api";

export default function MatrixHistoryPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleCancel = async (taskId) => {
        if (!window.confirm("Are you sure you want to cancel this task?")) return;

        try {
            await cancelTask(taskId);

            setTasks(prev => prev.map(t => t.id === taskId ? {...t, status: "cancelled"} : t));
        } catch (err) {
            console.error("Failed to cancel task:", err);
            alert("Failed to cancel task");
        }
    };

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await getMyTasks();
                setTasks(res); // сервер повертає масив завдань
            } catch (err) {
                console.error("Failed to load tasks:", err);
                setError("Failed to load tasks");
            } finally {
                setLoading(false);
            }
        }

        load();
        const interval = setInterval(load, 60000);
        return () => clearInterval(interval);
    }, []);



    if (loading)
        return (
            <div className="page-home">
                <Navbar />
                <div className="center">
                    <p>Loading tasks...</p>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="page-home">
                <Navbar />
                <div className="center">
                    <p className="error">{error}</p>
                </div>
            </div>
        );

    return (
        <div className="page-home">
            <Navbar />
            <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
                <div
                    className="map-card"
                    style={{
                        flex: 1,
                        maxWidth: "850px",
                        background: "#141414",
                        padding: "20px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                        color: "#f5f5f5",
                        border: "1px solid var(--accent)",
                    }}
                >
                    <h2 style={{ marginBottom: "20px" }}>Matrix Computation History</h2>

                    {tasks.length === 0 ? (
                        <p>No tasks found</p>
                    ) : (
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                textAlign: "left",
                                color: "#f5f5f5",
                            }}
                        >
                            <thead>
                            <tr style={{ borderBottom: "1px solid var(--accent)" }}>
                                <th style={{ padding: "10px" }}>ID</th>
                                <th style={{ padding: "10px", textAlign: "center" }}>Status</th>
                                <th style={{ padding: "10px", textAlign: "center" }}>Progress</th>
                                <th style={{ padding: "10px", textAlign: "center" }}>Created</th>
                                <th style={{ padding: "10px", textAlign: "center" }}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tasks.map((t) => (
                                <tr key={t.id} style={{ borderBottom: "1px solid #333" }}>
                                    <td style={{ padding: "10px" }}>{t.id}</td>
                                    <td style={{ padding: "10px", textAlign: "center" }}>
                                        {{
                                            pending: <span style={{ color: "orange" }}>Pending</span>,
                                            processing: <span style={{ color: "yellow" }}>Processing…</span>,
                                            completed: <span style={{ color: "lightgreen" }}>Completed</span>,
                                            failed: <span style={{ color: "red" }}>Failed</span>,
                                            cancelled: <span style={{ color: "gray" }}>Cancelled</span>,
                                        }[t.status] || t.status}
                                    </td>
                                    <td style={{ padding: "10px", textAlign: "center", width: "200px" }}>
                                        {(t.status === "pending" || t.status === "processing") ? (
                                            <div style={{ background: "#333", borderRadius: "4px", overflow: "hidden" }}>
                                                <div
                                                    style={{
                                                        width: `${t.progress || 0}%`,
                                                        background: "green",
                                                        height: "10px",
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            `${t.progress || 0}%`
                                        )}
                                    </td>
                                    <td style={{ padding: "10px", textAlign: "center" }}>
                                        {new Date(t.created_at).toLocaleString()}
                                    </td>
                                    <td style={{ padding: "10px", textAlign: "center" }}>
                                        {(t.status === "pending" || t.status === "processing") && (
                                            <button className="btn" style={{ marginRight: "10px" }} onClick={() => handleCancel(t.id)}>
                                                Cancel
                                            </button>
                                        )}
                                        {t.status === "completed" && (
                                            <a
                                                href={`/matrix/result/${t.id}`}
                                                className="btn"
                                                style={{
                                                    marginRight: "10px",
                                                    background: "green",
                                                    color: "#fff",
                                                    textDecoration: "none",
                                                    padding: "5px 10px",
                                                    borderRadius: "4px",
                                                }}
                                            >
                                                View Result
                                            </a>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
