import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function PieChart({ chartData }) {
    const options = {
        responsive: true,
        legend: {
            display: false,
            position: 'right',
        },

    }
    const userData = {
        labels: chartData.map((data) => data.year),
        datasets: [
            {
                data: chartData.map((data) => data.userGain),
                backgroundColor: [
                    "rgba(75,192,192,1)",
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    "#2a71d0",
                ],
                hoverOffset: 4

            },
        ],
    };

    return <Doughnut data={userData} options={options} />;
}

export default PieChart;