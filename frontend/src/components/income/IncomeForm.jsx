import { useEffect, useState } from "react";

import {
    createIncome,
    updateIncome
} from "../../services/incomeService";

import "./IncomeForm.css";

function IncomeForm({

    onSuccess,

    editIncome

}) {

    const [form, setForm] = useState({

        source: "",

        amount: "",

        incomeDate: ""

    });

    useEffect(() => {

        if (editIncome) {

            setForm({

                source: editIncome.source || "",

                amount: editIncome.amount || "",

                incomeDate: editIncome.incomeDate || ""

            });

        }

        else {

            setForm({

                source: "",

                amount: "",

                incomeDate: ""

            });

        }

    }, [editIncome]);

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const income = {

                source: form.source,

                amount: Number(form.amount),

                incomeDate: form.incomeDate

            };

            if (editIncome) {

                await updateIncome(

                    editIncome.id,

                    income

                );

                alert("Income Updated Successfully");

            }

            else {

                await createIncome(income);

                alert("Income Added Successfully");

            }

            onSuccess();

        }

        catch (error) {

            console.error(error);

            alert("Failed to save income.");

        }

    };

    return (

        <form

            className="income-form"

            onSubmit={handleSubmit}

        >

            <div className="form-group">

                <label>

                    Income Source

                </label>

                <input

                    type="text"

                    className="form-control"

                    placeholder="Salary, Freelancing..."

                    name="source"

                    value={form.source}

                    onChange={handleChange}

                    required

                />

            </div>

            <div className="form-group">

                <label>

                    Amount

                </label>

                <input

                    type="number"

                    className="form-control"

                    placeholder="Enter amount"

                    name="amount"

                    value={form.amount}

                    onChange={handleChange}

                    required

                />

            </div>

            <div className="form-group">

                <label>

                    Income Date

                </label>

                <input

                    type="date"

                    className="form-control"

                    name="incomeDate"

                    value={form.incomeDate}

                    onChange={handleChange}

                    required

                />

            </div>

            <button

                type="submit"

                className="save-income-btn"

            >

                {

                    editIncome

                        ? "Update Income"

                        : "Save Income"

                }

            </button>

        </form>

    );

}

export default IncomeForm;