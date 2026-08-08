import "./ReportToolbar.css";

import {
    FaSearch,
    FaFileExcel,
    FaFilePdf
} from "react-icons/fa";

function ReportToolbar({

    search,
    setSearch,
    onExportExcel,
    onExportPdf

}) {

    return (

        <div className="report-toolbar">

            <div className="report-search">

                <FaSearch />

                <input
                    type="text"
                    placeholder="Search month..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>

            <div className="report-export-actions">

                <button
                    className="report-export-btn excel"
                    onClick={onExportExcel}
                >

                    <FaFileExcel />

                    Export Excel

                </button>

                <button
                    className="report-export-btn pdf"
                    onClick={onExportPdf}
                >

                    <FaFilePdf />

                    Export PDF

                </button>

            </div>

        </div>

    );

}

export default ReportToolbar;