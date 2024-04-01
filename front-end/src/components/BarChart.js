import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function BarChart({ chartData }) {

    const userData = {
        labels: chartData.map((data) => data.TB),
        datasets: [
            {
                data: chartData.map((data) => data.cost),
                backgroundColor: [
                    "rgba(75,192,192,1)",
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    "#2a71d0",
                ],
                hoverOffset: 4,
                

            },
        ],
    };

    return <Bar data={userData} style={{paddingTop:20}} />;
}

export default BarChart;