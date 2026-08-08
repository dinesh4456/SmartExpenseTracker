import { useEffect, useState } from "react";

import MainLayout from "../../layouts/MainLayout";

import Loader from "../../components/ui/Loader";

import IncomeHeader from "../../components/income/IncomeHeader";
import IncomeToolbar from "../../components/income/IncomeToolbar";
import IncomeTable from "../../components/income/IncomeTable";
import IncomeModal from "../../components/income/IncomeModal";

import {
    getIncome,
    getIncomeById,
    deleteIncome
} from "../../services/incomeService";

function Income() {

    const [incomeList, setIncomeList] = useState([]);

    const [filteredIncome, setFilteredIncome] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);

    const [selectedIncome, setSelectedIncome] = useState(null);

    const [search, setSearch] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    useEffect(() => {
        loadIncome();
    }, []);

    useEffect(() => {

        let data = [...incomeList];

        if (search) {
            data = data.filter(item =>
                item.source?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (month) {
            data = data.filter(item => {
                if (!item.incomeDate) return false;
                const d = new Date(item.incomeDate);
                const mName = d.toLocaleString("en-US", { month: "long" });
                return mName.toLowerCase() === month.toLowerCase();
            });
        }

        if (year) {
            data = data.filter(item => {
                if (!item.incomeDate) return false;
                const d = new Date(item.incomeDate);
                return d.getFullYear().toString() === year.toString();
            });
        }

        setFilteredIncome(data);

    }, [
        incomeList,
        search,
        month,
        year
    ]);

    const loadIncome = async () => {

        try {

            const data = await getIncome();

            setIncomeList(data);

            setFilteredIncome(data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    };

    const handleAddIncome = () => {

        setSelectedIncome(null);

        setShowModal(true);

    };

    const handleEditIncome = async (id) => {

        try {

            const income = await getIncomeById(id);

            setSelectedIncome(income);

            setShowModal(true);

        }

        catch (error) {

            console.error(error);

            alert("Failed to load income.");

        }

    };

    const handleDeleteIncome = async (id) => {

        if (!window.confirm("Delete this income?")) {

            return;

        }

        try {

            await deleteIncome(id);

            loadIncome();

        }

        catch (error) {

            console.error(error);

            alert("Failed to delete income.");

        }

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

                {/* Income Header */}

                <IncomeHeader
                    onAddIncome={handleAddIncome}
                />

                {/* Search and Month/Year Filter */}

                <IncomeToolbar
                    search={search}
                    setSearch={setSearch}
                    month={month}
                    setMonth={setMonth}
                    year={year}
                    setYear={setYear}
                />

                {/* Income Table */}

                <IncomeTable
                    income={filteredIncome}
                    onEdit={handleEditIncome}
                    onDelete={handleDeleteIncome}
                />

                {/* Add / Edit Income Modal */}

                <IncomeModal
                    show={showModal}
                    handleClose={() => {

                        setShowModal(false);

                        setSelectedIncome(null);

                    }}
                    title={
                        selectedIncome
                            ? "Edit Income"
                            : "Add Income"
                    }
                    editIncome={selectedIncome}
                    onSuccess={() => {

                        setShowModal(false);

                        setSelectedIncome(null);

                        loadIncome();

                    }}
                />

            </div>

        </MainLayout>

    );

}

export default Income;