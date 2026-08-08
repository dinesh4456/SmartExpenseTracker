import "./ReportHeader.css";

import {
    FaChartBar,
    FaEnvelope
} from "react-icons/fa";

function ReportHeader({ onSendReport }) {

    return (

        <div className="report-header">

            <div>

                <h2>
                    📊 Reports
                </h2>

                <p>
                    View, analyze and export your monthly expense reports.
                </p>

            </div>

            <button
                className="report-email-btn"
                onClick={onSendReport}
            >

                <FaEnvelope />

                Send Report

            </button>

        </div>

    );

}

export default ReportHeader;