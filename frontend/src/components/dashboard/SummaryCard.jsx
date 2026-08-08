import {
    FaWallet,
    FaMoneyBillWave,
    FaBalanceScale,
    FaTags,
    FaExchangeAlt
} from "react-icons/fa";

function SummaryCard({ title, value, color }) {

    const icons = {
        "Total Income": <FaMoneyBillWave size={32} />,
        "Total Expense": <FaWallet size={32} />,
        "Balance": <FaBalanceScale size={32} />,
        "Categories": <FaTags size={32} />,
        "Transactions": <FaExchangeAlt size={32} />
    };

    return (

        <div className="col-md-4 col-lg-3 mb-4">

            <div className={`card ${color} text-white shadow border-0`}>

                <div className="card-body d-flex justify-content-between align-items-center">

                    <div>

                        <h6>{title}</h6>

                        <h3>{value}</h3>

                    </div>

                    <div>

                        {icons[title]}

                    </div>

                </div>

            </div>

        </div>

    );

}

export default SummaryCard;