import ExpenseForm from "./ExpenseForm";

function ExpenseModal({

    show,

    onClose,

    onSuccess,

    editExpense

}) {

    if (!show) return null;

    return (

        <div
            className="modal fade show"
            style={{
                display: "block",
                background: "rgba(0,0,0,.45)"
            }}
        >

            <div className="modal-dialog modal-lg modal-dialog-centered">

                <div
                    className="modal-content"
                    style={{
                        borderRadius: "20px"
                    }}
                >

                    <div className="modal-header">

                        <h5 className="modal-title">

                            {

                                editExpense

                                    ? "Edit Expense"

                                    : "Add Expense"

                            }

                        </h5>

                        <button

                            className="btn-close"

                            onClick={onClose}

                        />

                    </div>

                    <div className="modal-body">

                        <ExpenseForm

                            editExpense={editExpense}

                            onSuccess={onSuccess}

                        />

                    </div>

                </div>

            </div>

        </div>

    );

}

export default ExpenseModal;