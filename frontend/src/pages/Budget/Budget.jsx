import { useEffect, useState } from "react";

import MainLayout from "../../layouts/MainLayout";
import Loader from "../../components/ui/Loader";

import BudgetHeader from "../../components/budget/BudgetHeader";
import BudgetToolbar from "../../components/budget/BudgetToolbar";
import BudgetTable from "../../components/budget/BudgetTable";
import BudgetModal from "../../components/budget/BudgetModal";
import BudgetForm from "../../components/budget/BudgetForm";
import BudgetProgress from "../../components/dashboard/BudgetProgress";

import {
    getBudgets,
    deleteBudget
} from "../../services/budgetService";

function Budget() {

    const [budgets, setBudgets] = useState([]);
    const [filteredBudgets, setFilteredBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);

    const [search, setSearch] = useState("");

    useEffect(() => {
        loadBudgets();
    }, []);

    useEffect(() => {
        if (!search) {
            setFilteredBudgets(budgets);
            return;
        }

        const keyword = search.toLowerCase();
        setFilteredBudgets(
            budgets.filter(budget =>
                budget.month?.toLowerCase().includes(keyword) ||
                budget.year?.toString().includes(keyword)
            )
        );
    }, [search, budgets]);

    const loadBudgets = async () => {
        try {
            const data = await getBudgets();
            const list = Array.isArray(data) ? data : [];
            setBudgets(list);
            setFilteredBudgets(list);
        } catch (error) {
            console.error("Failed to load budgets:", error);
            setBudgets([]);
            setFilteredBudgets([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBudget = () => {
        setSelectedBudget(null);
        setShowModal(true);
    };

    const handleEditBudget = (budget) => {
        setSelectedBudget(budget);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this budget?")) {
            return;
        }

        try {
            await deleteBudget(id);
            alert("Budget Deleted Successfully");
            await loadBudgets();
        } catch (error) {
            console.error(error);
            alert("Unable to delete budget.");
        }
    };

    const handleSuccess = async () => {
        setShowModal(false);
        setSelectedBudget(null);
        await loadBudgets();
    };

    if (loading) {
        return (
            <MainLayout>
                <Loader />
            </MainLayout>
        );
    }

    return (

        <MainLayout>

            <div style={{ zoom: "1.0" }}>

                {/* Header */}
                <BudgetHeader
                    onAddBudget={handleAddBudget}
                />

                {/* Live Monthly Budget Progress Card */}
                <div className="mb-4">
                    <BudgetProgress />
                </div>

                {/* Search / Filter Toolbar */}
                <BudgetToolbar
                    search={search}
                    setSearch={setSearch}
                />

                {/* Budget Table with Edit & Delete */}
                <BudgetTable
                    budgets={filteredBudgets}
                    onEdit={handleEditBudget}
                    onDelete={handleDelete}
                />

                {/* Add / Edit Budget Modal */}
                <BudgetModal
                    show={showModal}
                    handleClose={() => {
                        setShowModal(false);
                        setSelectedBudget(null);
                    }}
                    title={
                        selectedBudget
                            ? "Edit Budget"
                            : "Add Budget"
                    }
                >
                    <BudgetForm
                        editBudget={selectedBudget}
                        onSuccess={handleSuccess}
                    />
                </BudgetModal>

            </div>

        </MainLayout>

    );

}

export default Budget;