import "./BudgetModal.css";

function BudgetModal({

    show,

    handleClose,

    title,

    children

}) {

    if (!show) return null;

    return (

        <div className="budget-modal-overlay">

            <div className="budget-modal">

                <div className="budget-modal-header">

                    <h4>

                        {title}

                    </h4>

                    <button

                        className="budget-close-btn"

                        onClick={handleClose}

                    >

                        ×

                    </button>

                </div>

                <div className="budget-modal-body">

                    {children}

                </div>

            </div>

        </div>

    );

}

export default BudgetModal;