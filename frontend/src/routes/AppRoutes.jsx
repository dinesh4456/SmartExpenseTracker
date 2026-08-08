import { Routes, Route } from "react-router-dom";

import Profile from "../pages/Profile/Profile";
import Reports from "../pages/Reports/Reports";
import Budget from "../pages/Budget/Budget";
import Income from "../pages/Income/Income";
import Categories from "../pages/Categories/Categories";
import Login from "../pages/Login/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Dashboard from "../pages/Dashboard/Dashboard";
import Expenses from "../pages/Expenses/Expenses";
import AIInsights from "../pages/AIInsights";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/expenses"
                element={
                    <ProtectedRoute>
                        <Expenses />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/categories"
                element={
                    <ProtectedRoute>
                        <Categories />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/income"
                element={
                    <ProtectedRoute>
                        <Income />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/budget"
                element={
                    <ProtectedRoute>
                        <Budget />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/reports"
                element={
                    <ProtectedRoute>
                        <Reports />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/ai-insights"
                element={
                    <ProtectedRoute>
                        <AIInsights />
                    </ProtectedRoute>
                }
            />

            {/* 404 Catch All */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;