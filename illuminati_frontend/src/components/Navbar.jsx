import React from "react";
import { useNavigate, Link } from "react-router-dom";


export default function Navbar() {
    const navigate = useNavigate();

    function handleLogout() {
        sessionStorage.clear();
        navigate("/login");
    }

    return (
        <nav
            className="navbar"
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 30px",
                backgroundColor: "#141414",
                color: "#f5f5f5",
                borderBottom: "1px solid var(--accent)",
                fontSize: "1.2em"
            }}
        >
            {/* Ліва частина */}
            <div className="nav-left" style={{ fontWeight: "bold" }}>
                Matrix Multiplication
            </div>

            {/* Центр */}
            <div
                className="nav-center"
                style={{ display: "flex", gap: "30px", justifyContent: "center", flex: 1 }}
            >
                <Link to="/matrix-history" style={{ color: "#f5f5f5", textDecoration: "none" }}>
                    History
                </Link>
                <Link to="/protected-home" style={{ color: "#f5f5f5", textDecoration: "none" }}>
                    Main
                </Link>
            </div>

            {/* Права частина */}
            <div className="nav-right">
                <button
                    onClick={handleLogout}
                    className="nav-btn"
                    style={{
                        padding: "8px 20px",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor: "var(--accent)",
                        color: "#f5f5f5",
                        fontWeight: "bold",
                        fontSize: "1em"
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
