import { useEffect, useState } from "react";

import {
    createExpense,
    updateExpense
} from "../../services/expenseService";

import { getCategories } from "../../services/categoryService";

function ExpenseForm({

    editExpense,

    onSuccess

}) {

    const [categories, setCategories] = useState([]);

    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({

        title: "",

        amount: "",

        description: "",

        expenseDate: "",

        categoryId: ""

    });

    useEffect(() => {

        loadCategories();

    }, []);

    useEffect(() => {

        if (editExpense) {

            let catId = "";
            if (editExpense.category && typeof editExpense.category === "object") {
                catId = editExpense.category.id || "";
            } else if (typeof editExpense.category === "string" && categories.length > 0) {
                const matched = categories.find(
                    c => c.name.toLowerCase() === editExpense.category.toLowerCase()
                );
                if (matched) catId = matched.id;
            } else if (editExpense.categoryId) {
                catId = editExpense.categoryId;
            }

            setForm({

                title: editExpense.title || "",

                amount: editExpense.amount || "",

                description: editExpense.description || "",

                expenseDate: editExpense.expenseDate || "",

                categoryId: catId

            });

        }

        else {

            resetForm();

        }

    }, [editExpense, categories]);

    const loadCategories = async () => {

        try {

            const data = await getCategories();

            setCategories(data);

        }

        catch (error) {

            console.error(error);

        }

    };

    const resetForm = () => {

        setForm({

            title: "",

            amount: "",

            description: "",

            expenseDate: "",

            categoryId: ""

        });

    };

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (

            !form.title ||

            !form.amount ||

            !form.expenseDate ||

            !form.categoryId

        ) {

            alert("Please fill all required fields.");

            return;

        }

        setSaving(true);

        try {

            const expense = {

                title: form.title,

                amount: Number(form.amount),

                description: form.description,

                expenseDate: form.expenseDate,

                category: {

                    id: Number(form.categoryId)

                }

            };

            if (editExpense) {

                await updateExpense(

                    editExpense.id,

                    expense

                );

                alert("Expense updated successfully.");

            }

            else {

                await createExpense(expense);

                alert("Expense added successfully.");

            }

            resetForm();

            onSuccess();

        }

        catch (error) {

            console.error(error);

            alert("Failed to save expense.");

        }

        finally {

            setSaving(false);

        }

    };

    return (

        <form onSubmit={handleSubmit}>

            <div className="mb-3">

                <label className="form-label">

                    Title

                </label>

                <input

                    className="form-control"

                    name="title"

                    value={form.title}

                    onChange={handleChange}

                    placeholder="Expense Title"

                    required

                />

            </div>

            <div className="mb-3">

                <label className="form-label">

                    Amount

                </label>

                <input

                    type="number"

                    className="form-control"

                    name="amount"

                    value={form.amount}

                    onChange={handleChange}

                    placeholder="Enter Amount"

                    required

                />

            </div>

            <div className="mb-3">

                <label className="form-label">

                    Description

                </label>

                <textarea

                    rows="3"

                    className="form-control"

                    name="description"

                    value={form.description}

                    onChange={handleChange}

                    placeholder="Optional"

                />

            </div>

            <div className="row">

                <div className="col-md-6 mb-3">

                    <label className="form-label">

                        Expense Date

                    </label>

                    <input

                        type="date"

                        className="form-control"

                        name="expenseDate"

                        value={form.expenseDate}

                        onChange={handleChange}

                        required

                    />

                </div>

                <div className="col-md-6 mb-3">

                    <label className="form-label">

                        Category

                    </label>

                    <select

                        className="form-select"

                        name="categoryId"

                        value={form.categoryId}

                        onChange={handleChange}

                        required

                    >

                        <option value="">

                            Select Category

                        </option>

                        {

                            categories.map(category => (

                                <option

                                    key={category.id}

                                    value={category.id}

                                >

                                    {category.name}

                                </option>

                            ))

                        }

                    </select>

                </div>

            </div>

            <div className="text-end mt-4">

                <button

                    className="btn btn-success px-4"

                    type="submit"

                    disabled={saving}

                >

                    {

                        saving

                            ? "Saving..."

                            : editExpense

                                ? "Update Expense"

                                : "Save Expense"

                    }

                </button>

            </div>

        </form>

    );

}

export default ExpenseForm;