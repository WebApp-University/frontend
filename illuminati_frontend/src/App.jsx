import { Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedHome from "./pages/MainPage.jsx";
import MatrixHistoryPage from "./pages/MatrixHistoryPage";
import MatrixResultPage from "./pages/MatrixResultPage";
import ProtectedAuth from "./components/ProtectedAuth";

export default function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/protected-home"
                    element={
                        <ProtectedAuth>
                            <ProtectedHome />
                        </ProtectedAuth>
                    }
                />

                <Route
                    path="/matrix-history"
                    element={
                        <ProtectedAuth>
                            <MatrixHistoryPage />
                        </ProtectedAuth>
                    }
                />

                <Route path="/matrix/result/:id"
                       element={
                    <MatrixResultPage/>
                }
                />
            </Routes>
        </div>
    );
}
