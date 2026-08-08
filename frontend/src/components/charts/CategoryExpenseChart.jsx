import { useEffect, useState } from "react";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

import { getCategoryExpenseChart } from "../../services/chartService";

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF4560",
    "#775DD0"
];

function CategoryExpenseChart() {

    const [data, setData] = useState([]);

    useEffect(() => {

        loadChart();

    }, []);

    const loadChart = async () => {

        try {

            const response = await getCategoryExpenseChart();

            console.log("Chart Data:", response);

            setData(response);

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <div className="card mt-4">

            <div className="card-body">

                <h4 className="mb-3">
                    Category Expense Chart
                </h4>

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >

                    <PieChart>

                        <Pie
                            data={data}
                            dataKey="totalAmount"
                            nameKey="category"
                            outerRadius={120}
                            label
                        >

                            {
                                data.map((entry, index) => (

                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />

                                ))
                            }

                        </Pie>

                        <Tooltip />

                        <Legend />

                    </PieChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}

export default CategoryExpenseChart;