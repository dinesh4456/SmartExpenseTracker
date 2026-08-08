import "./IncomeModal.css";

import { FaTimes } from "react-icons/fa";

import IncomeForm from "./IncomeForm";

function IncomeModal({

    show,

    handleClose,

    title,

    editIncome,

    onSuccess

}) {

    if (!show) {

        return null;

    }

    return (

        <div className="income-modal-overlay">

            <div className="income-modal">

                <div className="income-modal-header">

                    <h4>

                        {title}

                    </h4>

                    <button

                        className="close-modal-btn"

                        onClick={handleClose}

                    >

                        <FaTimes />

                    </button>

                </div>

                <div className="income-modal-body">

                    <IncomeForm

                        editIncome={editIncome}

                        onSuccess={onSuccess}

                    />

                </div>

            </div>

        </div>

    );

}

export default IncomeModal;