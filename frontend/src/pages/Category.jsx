import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
    saveCategory,
    getAllCategories,
    deleteCategory
} from "../services/categoryService";

function Category() {

    const [category, setCategory] = useState({
        name: "",
        description: "",
        type: "EXPENSE"
    });

    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {

        try {

            const data = await getAllCategories();

            setCategoryList(data);

        } catch (error) {

            console.error(error);

        }

    };

    const handleChange = (e) => {

        setCategory({
            ...category,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await saveCategory(category);

            alert("Category Saved Successfully");

            await loadCategories();

            setCategory({
                name: "",
                description: "",
                type: "EXPENSE"
            });

        } catch (error) {

            console.error(error);

            alert("Failed to Save Category");

        }

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmDelete) return;

        try {

            await deleteCategory(id);

            alert("Category Deleted Successfully");

            loadCategories();

        } catch (error) {

            console.error(error);

            alert("Failed to Delete Category");

        }

    };

    return (

        <MainLayout>

            <h2 className="mb-4">Category Management</h2>

            <div className="card shadow">

                <div className="card-body">

                    <h5>Add Category</h5>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label>Category Name</label>

                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={category.name}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label>Description</label>

                            <textarea
                                name="description"
                                className="form-control"
                                rows="3"
                                value={category.description}
                                onChange={handleChange}
                            ></textarea>

                        </div>

                        <div className="mb-3">

                            <label>Type</label>

                            <select
                                name="type"
                                className="form-select"
                                value={category.type}
                                onChange={handleChange}
                            >

                                <option value="EXPENSE">Expense</option>

                                <option value="INCOME">Income</option>

                            </select>

                        </div>

                        <button
                            className="btn btn-primary"
                            type="submit"
                        >
                            Save Category
                        </button>

                    </form>

                </div>

            </div>

            <div className="card shadow mt-4">

                <div className="card-body">

                    <h5>Category List</h5>

                    <table className="table table-bordered table-striped">

                        <thead>

                            <tr>

                                <th>Name</th>

                                <th>Description</th>

                                <th>Type</th>

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                categoryList.length > 0 ?

                                    categoryList.map((item) => (

                                        <tr key={item.id}>

                                            <td>{item.name}</td>

                                            <td>{item.description}</td>

                                            <td>{item.type}</td>

                                            <td>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                    :

                                    <tr>

                                        <td colSpan="4" className="text-center">

                                            No Categories Found

                                        </td>

                                    </tr>

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </MainLayout>

    );

}

export default Category;