import axios from "../api/axiosConfig";

// =========================================
// GET REPORT
// =========================================

export const getMonthlyReport = async (
    year = "",
    month = ""
) => {

    let url = "/reports/monthly";

    const params = [];

    if (year !== "") {
        params.push(`year=${year}`);
    }

    if (month !== "") {
        params.push(`month=${month}`);
    }

    if (params.length > 0) {
        url += "?" + params.join("&");
    }

    const response = await axios.get(url);
    return response.data;
};

// =========================================
// EXPORT EXCEL
// =========================================

export const exportMonthlyExcel = async (
    year,
    month
) => {

    let url = "/reports/export/monthly-excel";

    const params = [];

    if (year !== undefined && year !== "") {
        params.push(`year=${year}`);
    }

    if (month !== undefined && month !== "") {
        params.push(`month=${month}`);
    }

    if (params.length > 0) {
        url += "?" + params.join("&");
    }

    const response = await axios.get(url, {
        responseType: "blob"
    });

    const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = (month && month !== "" && month !== 0)
        ? `financial-report-${year}-${month}.xlsx`
        : `financial-report-${year || "all"}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
};

// =========================================
// EXPORT PDF
// =========================================

export const exportMonthlyPdf = async (
    year,
    month
) => {

    let url = "/reports/export/monthly-pdf";

    const params = [];

    if (year !== undefined && year !== "") {
        params.push(`year=${year}`);
    }

    if (month !== undefined && month !== "") {
        params.push(`month=${month}`);
    }

    if (params.length > 0) {
        url += "?" + params.join("&");
    }

    const response = await axios.get(url, {
        responseType: "blob"
    });

    const blob = new Blob([response.data], {
        type: "application/pdf"
    });

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = (month && month !== "" && month !== 0)
        ? `financial-report-${year}-${month}.pdf`
        : `financial-report-${year || "all"}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
};