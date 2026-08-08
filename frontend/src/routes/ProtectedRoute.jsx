import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    const { token } = useContext(AuthContext);
    const storedToken = localStorage.getItem("token");
    const location = useLocation();

    if (!token && !storedToken) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedRoute;
