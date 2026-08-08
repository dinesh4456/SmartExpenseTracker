import { useEffect, useState, useMemo } from "react";
import { FaPlusCircle, FaFolder, FaCheckDouble, FaTrashAlt, FaPen, FaFilter, FaCalendarAlt, FaCalendar } from "react-icons/fa";

import MainLayout from "../../layouts/MainLayout";
import CategoryForm from "./CategoryForm";
import CategoryModal from "../../components/categories/CategoryModal";

import {
    getCategories,
    getCategoriesWithStats,
    getCategoryStats,
    getCategoryById,
    deleteCategory
} from "../../services/categoryService";

import "./Categories.css";
import "../../components/expenses/ExpenseToolbar.css";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function Categories() {

    const currentYear = new Date().getFullYear();
    const currentMonthName = MONTHS[new Date().getMonth()];
    const dynamicYears = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);

    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState({
        totalCategories: 0,
        usedCategories: 0
    });

    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Filter toolbar states (same as Expenses page)
    const [categoryFilter, setCategoryFilter] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(currentMonthName);
    const [selectedYear, setSelectedYear] = useState(currentYear.toString());

    // Delete confirmation modal state
    const [deleteModal, setDeleteModal] = useState({
        show: false,
        categoryId: null,
        categoryName: ""
    });

    useEffect(() => {
        loadData();
    }, [selectedMonth, selectedYear]);

    const loadData = async () => {
        try {
            const monthNum = selectedMonth ? MONTHS.indexOf(selectedMonth) + 1 : null;
            const yearNum = selectedYear ? Number(selectedYear) : null;

            const cats = await getCategoriesWithStats("", "az", yearNum, monthNum);
            const list = Array.isArray(cats) ? cats : [];
            setCategories(list);

            const usedCount = list.filter(c => Number(c.totalSpent || 0) > 0).length;
            setStats({
                totalCategories: list.length,
                usedCategories: usedCount
            });
        } catch (error) {
            console.error("Failed to load categories with stats, trying plain:", error);
            try {
                const plain = await getCategories();
                const list = Array.isArray(plain) ? plain : [];
                setCategories(list.map(c => ({ id: c.id, name: c.name, totalSpent: 0 })));
                setStats({
                    totalCategories: list.length,
                    usedCategories: 0
                });
            } catch (err) {
                console.error("Plain category load failed:", err);
            }
        }
    };

    const handleAddCategory = () => {
        setSelectedCategory(null);
        setShowModal(true);
    };

    const handleEditCategory = async (id) => {
        try {
            const category = await getCategoryById(id);
            setSelectedCategory(category);
            setShowModal(true);
        } catch (error) {
            console.error(error);
            alert("Failed to load category.");
        }
    };

    const promptDelete = (id, name) => {
        setDeleteModal({
            show: true,
            categoryId: id,
            categoryName: name
        });
    };

    const confirmDelete = async () => {
        const id = deleteModal.categoryId;
        setDeleteModal({ show: false, categoryId: null, categoryName: "" });

        try {
            await deleteCategory(id);
            alert("Category deleted successfully.");
            loadData();
        } catch (error) {
            console.error(error);
            alert("This category is already used in expenses.");
        }
    };

    // Category dropdown filter
    const filteredCategories = useMemo(() => {
        if (!categoryFilter) return categories;
        return categories.filter((c) =>
            c.name?.toLowerCase() === categoryFilter.toLowerCase()
        );
    }, [categories, categoryFilter]);

    const activePeriodLabel = selectedMonth
        ? `${selectedMonth} ${selectedYear || ""}`
        : selectedYear
        ? `Year ${selectedYear}`
        : "All Time";

    return (

        <MainLayout>

            <div style={{ zoom: "1.0" }}>

                {/* HEADER */}
                <div className="category-header">
                    <div>
                        <h2>🏷️ Categories</h2>
                        <p>Create and manage your expense categories for {activePeriodLabel}.</p>
                    </div>

                    <button className="category-add-btn" onClick={handleAddCategory}>
                        <FaPlusCircle /> Add Category
                    </button>
                </div>

                {/* 2 SIMPLE STATISTICS CARDS */}
                <div className="row g-3 mb-4">

                    <div className="col-md-6 col-sm-6">
                        <div className="category-stat-card shadow-sm">
                            <div className="category-stat-icon" style={{ background: "#2563EB" }}>
                                <FaFolder />
                            </div>
                            <div>
                                <small>Total Categories</small>
                                <h4>{stats.totalCategories}</h4>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-sm-6">
                        <div className="category-stat-card shadow-sm">
                            <div className="category-stat-icon" style={{ background: "#10B981" }}>
                                <FaCheckDouble />
                            </div>
                            <div>
                                <small>Used in {selectedMonth || "Period"}</small>
                                <h4>{stats.usedCategories}</h4>
                            </div>
                        </div>
                    </div>

                </div>

                {/* MODAL */}
                <CategoryModal
                    show={showModal}
                    handleClose={() => {
                        setShowModal(false);
                        setSelectedCategory(null);
                    }}
                    title={selectedCategory ? "Edit Category" : "Add Category"}
                >
                    <CategoryForm
                        editCategory={selectedCategory}
                        onCancel={() => {
                            setShowModal(false);
                            setSelectedCategory(null);
                        }}
                        onSuccess={() => {
                            setShowModal(false);
                            setSelectedCategory(null);
                            loadData();
                        }}
                    />
                </CategoryModal>

                {/* DELETE CONFIRMATION MODAL */}
                {deleteModal.show && (
                    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content" style={{ borderRadius: "20px", padding: "10px" }}>
                                <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title fw-bold text-danger d-flex align-items-center gap-2">
                                        <FaTrashAlt /> Delete Category?
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setDeleteModal({ show: false, categoryId: null, categoryName: "" })}
                                    ></button>
                                </div>
                                <div className="modal-body py-3">
                                    <p className="mb-1">
                                        Are you sure you want to delete <strong>"{deleteModal.categoryName}"</strong>?
                                    </p>
                                    <small className="text-muted">This action cannot be undone.</small>
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button
                                        type="button"
                                        className="btn btn-light px-4"
                                        onClick={() => setDeleteModal({ show: false, categoryId: null, categoryName: "" })}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger px-4"
                                        onClick={confirmDelete}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* FILTER TOOLBAR: Category Filter Dropdown + Month + Year (Same as Expenses page) */}
                <div className="expense-toolbar mb-4">

                    {/* Category Filter Dropdown showing all created categories */}
                    <div className="toolbar-filter">
                        <FaFilter />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map((c) => (
                                <option key={c.id || c.name} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Month Filter */}
                    <div className="toolbar-filter">
                        <FaCalendarAlt />
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            <option value="">All Months</option>
                            {MONTHS.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Year Filter */}
                    <div className="toolbar-filter">
                        <FaCalendar />
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            <option value="">All Years</option>
                            {dynamicYears.map((y) => (
                                <option key={y} value={y.toString()}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>

                {/* SIMPLE TABLE: | Category Name | Total Expenses | Actions | */}
                <div className="category-table-container">

                    <table className="category-table">

                        <thead>
                            <tr>
                                <th>Category Name</th>
                                <th>Total Expenses ({selectedMonth ? selectedMonth.substring(0, 3) : "Total"})</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="category-empty py-5 text-center">
                                        <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                                            <span style={{ fontSize: "36px" }}>📁</span>
                                            <span className="fw-semibold">No Categories Found</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((category) => (
                                    <tr key={category.id}>
                                        <td className="category-name fw-semibold">
                                            🏷️ {category.name}
                                        </td>

                                        <td className="fw-bold text-dark">
                                            {category.totalSpent && category.totalSpent > 0
                                                ? `₹${Number(category.totalSpent).toLocaleString()}`
                                                : "₹0"}
                                        </td>

                                        <td>
                                            <div className="category-actions justify-content-end">
                                                <button
                                                    className="category-edit-btn"
                                                    onClick={() => handleEditCategory(category.id)}
                                                    title="Edit Category"
                                                >
                                                    <FaPen /> Edit
                                                </button>

                                                <button
                                                    className="category-delete-btn"
                                                    onClick={() => promptDelete(category.id, category.name)}
                                                    title="Delete Category"
                                                >
                                                    <FaTrashAlt /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>

                </div>

            </div>

        </MainLayout>

    );

}

export default Categories;