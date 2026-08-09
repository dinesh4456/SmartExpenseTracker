import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import DashboardHero from "../../components/dashboard/DashboardHero";
import AIInsightCard from "../../components/dashboard/AIInsightCard";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import BudgetProgress from "../../components/dashboard/BudgetProgress";
import QuickActions from "../../components/dashboard/QuickActions";

import StatCard from "../../components/ui/StatCard";
import Loader from "../../components/ui/Loader";

import MonthlyExpenseChart from "../../components/charts/MonthlyExpenseChart";
import CategoryExpenseChart from "../../components/charts/CategoryExpenseChart";

import {
    FaMoneyBillWave,
    FaWallet,
    FaPiggyBank,
    FaReceipt
} from "react-icons/fa";

import { getDashboardSummary } from "../../services/dashboardService";
import { getAIInsights } from "../../services/aiInsightService";

function Dashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            const dashboardData = await getDashboardSummary();

            setDashboard(dashboardData);

            try {

                const aiData = await getAIInsights();

                setInsight(aiData);

            } catch (error) {

                console.warn("AI Insights unavailable:", error);

            }

        } catch (error) {

            console.error("Dashboard Error:", error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (
            <MainLayout>
                <Loader />
            </MainLayout>
        );

    }

    if (!dashboard) {

        return (
            <MainLayout>

                <div
                    className="container mt-5"
                >

                    <div className="alert alert-danger">

                        <h5>Unable to load Dashboard.</h5>

                        <p className="mb-3">
                            The backend may not be running or one of the APIs failed.
                        </p>

                        <button
                            className="btn btn-primary"
                            onClick={loadDashboard}
                        >
                            Retry
                        </button>

                    </div>

                </div>

            </MainLayout>
        );

    }

    return (
        <MainLayout>
            <div className="dashboard-page-container">
                {/* Hero */}
                <DashboardHero
                    dashboard={dashboard}
                />

                {/* Statistics */}

                <div className="row g-4 mb-5">

                    <div className="col-xl-3 col-md-6">

                        <StatCard
                            title="Total Income"
                            value={`₹${Number(
                                dashboard.totalIncome ?? 0
                            ).toLocaleString()}`}
                            subtitle="Healthy monthly earnings"
                            icon={<FaMoneyBillWave />}
                            color="#10B981"
                            onClick={() => navigate("/income")}
                        />

                    </div>

                    <div className="col-xl-3 col-md-6">

                        <StatCard
                            title="Total Expense"
                            value={`₹${Number(
                                dashboard.totalExpense ?? 0
                            ).toLocaleString()}`}
                            subtitle="Money you've spent"
                            icon={<FaWallet />}
                            color="#EF4444"
                            onClick={() => navigate("/expenses")}
                        />

                    </div>

                    <div className="col-xl-3 col-md-6">

                        <StatCard
                            title="Available Balance"
                            value={`₹${Number(
                                dashboard.balance ?? 0
                            ).toLocaleString()}`}
                            subtitle="Current savings"
                            icon={<FaPiggyBank />}
                            color="#2563EB"
                        />

                    </div>

                    <div className="col-xl-3 col-md-6">

                        <StatCard
                            title="Transactions"
                            value={dashboard.totalTransactions ?? 0}
                            subtitle="Income & Expenses"
                            icon={<FaReceipt />}
                            color="linear-gradient(135deg, #8B5CF6, #6366F1)"
                            onClick={() => {
                                const el = document.getElementById("recent-transactions-section");
                                if (el) {
                                    el.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                        />

                    </div>

                </div>

                {/* Budget Progress */}

                <BudgetProgress />

                {/* Charts */}

                <h4 className="fw-bold mt-5 mb-4">
                    Financial Analytics
                </h4>

                <div className="row">

                    <div className="col-lg-6 mb-4">

                        <MonthlyExpenseChart />

                    </div>

                    <div className="col-lg-6 mb-4">

                        <CategoryExpenseChart />

                    </div>

                </div>

                {/* AI */}

                {insight && (

                    <>

                        <h4 className="fw-bold mb-3">
                            AI Financial Assistant
                        </h4>

                        <AIInsightCard
                            insight={insight}
                        />

                    </>

                )}

                {/* Recent Transactions */}

                <div className="row mt-4" id="recent-transactions-section">

                    <div className="col-12">

                        <RecentTransactions />

                    </div>

                </div>

                {/* Quick Actions */}

                <div className="row mt-4">

                    <div className="col-12">

                        <QuickActions />

                    </div>

                </div>

            </div>

        </MainLayout>

    );

}

export default Dashboard;