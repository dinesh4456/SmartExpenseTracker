import { useEffect, useState } from "react";

import MainLayout from "../../layouts/MainLayout";

import Loader from "../../components/ui/Loader";

import ExpenseHeader from "../../components/expenses/ExpenseHeader";
import ExpenseToolbar from "../../components/expenses/ExpenseToolbar";
import ExpenseTable from "../../components/expenses/ExpenseTable";
import ExpenseModal from "../../components/expenses/ExpenseModal";

import {
    getExpenses,
    getExpenseById,
    deleteExpense
} from "../../services/expenseService";

function Expenses() {

    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editExpense, setEditExpense] = useState(null);

    useEffect(() => {
        loadExpenses();
    }, []);

    useEffect(() => {

        let data = [...expenses];

        if (search) {
            data = data.filter(expense =>
                expense.title?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (category) {
            data = data.filter(expense => {
                if (expense.category?.name) {
                    return expense.category.name.toLowerCase() === category.toLowerCase();
                }
                return typeof expense.category === "string" && expense.category.toLowerCase() === category.toLowerCase();
            });
        }

        if (month) {
            data = data.filter(expense => {
                if (!expense.expenseDate) return false;
                const d = new Date(expense.expenseDate);
                const mName = d.toLocaleString("en-US", { month: "long" });
                return mName.toLowerCase() === month.toLowerCase();
            });
        }

        if (year) {
            data = data.filter(expense => {
                if (!expense.expenseDate) return false;
                const d = new Date(expense.expenseDate);
                return d.getFullYear().toString() === year.toString();
            });
        }

        setFilteredExpenses(data);

    }, [
        expenses,
        search,
        category,
        month,
        year
    ]);

    const loadExpenses = async () => {
        try {
            const data = await getExpenses();
            setExpenses(data || []);
            setFilteredExpenses(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this expense?")) {
            return;
        }

        try {
            await deleteExpense(id);
            loadExpenses();
        } catch (error) {
            console.error(error);
            alert("Failed to delete expense.");
        }
    };

    const handleAddExpense = () => {
        setEditExpense(null);
        setShowModal(true);
    };

    const handleEdit = async (id) => {
        try {
            const expense = await getExpenseById(id);
            setEditExpense(expense);
            setShowModal(true);
        } catch (error) {
            console.error(error);
            alert("Failed to load expense.");
        }
    };

    const handleSuccess = () => {
        setShowModal(false);
        setEditExpense(null);
        loadExpenses();
    };

    if (loading) {
        return (
            <MainLayout>
                <div style={{ zoom: "1.0" }}>
                    <Loader />
                </div>
            </MainLayout>
        );
    }

    return (

        <MainLayout>

            <div style={{ zoom: "1.0" }}>

                <ExpenseHeader
                    onAddExpense={handleAddExpense}
                />

                <ExpenseToolbar
                    search={search}
                    setSearch={setSearch}
                    category={category}
                    setCategory={setCategory}
                    month={month}
                    setMonth={setMonth}
                    year={year}
                    setYear={setYear}
                />

                <ExpenseTable
                    expenses={filteredExpenses}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                <ExpenseModal
                    show={showModal}
                    onClose={() => {

                        setShowModal(false);

                        setEditExpense(null);

                    }}
                    editExpense={editExpense}
                    onSuccess={handleSuccess}
                />

            </div>

        </MainLayout>

    );

}

export default Expenses;