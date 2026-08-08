import { useEffect, useState } from "react";
import { createCategory, updateCategory } from "../../services/categoryService";

function CategoryForm({ onSuccess, onCancel, editCategory }) {

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (editCategory) {
            setName(editCategory.name || "");
        } else {
            setName("");
        }
        setError("");
    }, [editCategory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const trimmedName = name.trim();
        if (!trimmedName) {
            setError("Category name is required.");
            return;
        }

        if (trimmedName.length < 2 || trimmedName.length > 50) {
            setError("Category name must be between 2 and 50 characters.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: trimmedName,
                type: "EXPENSE",
                description: ""
            };

            if (editCategory) {
                await updateCategory(editCategory.id, payload);
                alert("Category updated successfully.");
            } else {
                await createCategory(payload);
                alert("Category created successfully.");
            }

            onSuccess();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || err.response?.data || "Category already exists.";
            setError(typeof msg === "string" ? msg : "Category already exists.");
        } finally {
            setLoading(false);
        }
    };

    return (

        <form onSubmit={handleSubmit}>

            {error && (
                <div className="alert alert-danger py-2 px-3 mb-3 small">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <label className="form-label fw-semibold">
                    Category Name
                </label>
                <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="e.g. Food, Travel, Shopping"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setError("");
                    }}
                    style={{ borderRadius: "12px", fontSize: "15px" }}
                    autoFocus
                    required
                />
            </div>

            <div className="d-flex justify-content-end gap-2">
                {onCancel && (
                    <button
                        type="button"
                        className="btn btn-light px-4"
                        onClick={onCancel}
                        style={{ borderRadius: "10px" }}
                    >
                        Cancel
                    </button>
                )}
                <button
                    className="btn btn-primary px-4 fw-semibold"
                    type="submit"
                    disabled={loading}
                    style={{
                        background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                        borderRadius: "10px",
                        border: "none"
                    }}
                >
                    {loading ? "Saving..." : "Save"}
                </button>
            </div>

        </form>

    );

}

export default CategoryForm;