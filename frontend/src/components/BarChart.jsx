import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function BarChart({ income, expense }) {

    const data = {
        labels: ["Income", "Expense"],
        datasets: [
            {
                label: "Amount (₹)",
                data: [income, expense],
                backgroundColor: [
                    "#198754",
                    "#dc3545"
                ]
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: "Income vs Expense"
            }
        }
    };

    return (
        <Bar
            data={data}
            options={options}
        />
    );
}

export default BarChart;