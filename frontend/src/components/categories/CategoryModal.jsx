import "./CategoryModal.css";

function CategoryModal({
    show,
    handleClose,
    title,
    children
}) {

    if (!show) {
        return null;
    }

    return (

        <div className="category-modal-overlay">

            <div className="category-modal">

                <div className="category-modal-header">

                    <div>

                        <h3>{title}</h3>

                        <p>

                            Manage your financial category

                        </p>

                    </div>

                    <button
                        className="category-modal-close"
                        onClick={handleClose}
                    >

                        ×

                    </button>

                </div>

                <div className="category-modal-body">

                    {children}

                </div>

            </div>

        </div>

    );

}

export default CategoryModal;