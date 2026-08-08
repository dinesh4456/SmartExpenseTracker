import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

function PieChart({ income, expense }) {

    const data = {
        labels: ["Income", "Expense"],
        datasets: [
            {
                data: [income, expense],
                backgroundColor: [
                    "#198754",
                    "#dc3545"
                ],
                borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom"
            },
            title: {
                display: true,
                text: "Income vs Expense Distribution"
            }
        }
    };

    return (
        <Pie
            data={data}
            options={options}
        />
    );
}

export default PieChart;