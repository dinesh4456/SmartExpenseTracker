import { useEffect, useState } from "react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

import { getMonthlyExpenseChart } from "../../services/chartService";

function MonthlyExpenseChart() {

    const [data, setData] = useState([]);

    useEffect(() => {

        loadChart();

    }, []);

    const loadChart = async () => {

        try {

            const response = await getMonthlyExpenseChart();

            console.log("Monthly Chart:", response);

            setData(response);

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <div className="card">

            <div className="card-body">

                <h4 className="mb-3">

                    Monthly Expense Trend

                </h4>

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >

                    <LineChart data={data}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="label" />

                        <YAxis />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#0d6efd"
                            strokeWidth={3}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}

export default MonthlyExpenseChart;