import React from "react";
import { Navigate } from "react-router-dom";
import { getAuthToken } from "../auth";

export default function ProtectedAuth({ children }) {

    if (!getAuthToken()) {
        return <Navigate to="/login" replace />;
    }

    return children;
}