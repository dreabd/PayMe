import React, { useState } from "react";
import { useSelector } from 'react-redux';

import { Line } from 'react-chartjs-2'

function ChartData({ stats, color }) {
    // ----------------------Constants----------------------
    const paid = stats.trans_paid
    const requested = stats.trans_requested

    const userTransactionStats = [...paid, ...requested]



    const label = []
    const data = []
    const reducer = []

    userTransactionStats && userTransactionStats
        .sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        })
        .reverse().forEach(trans => {
            /*
            Pushing in the data into labels and the difference in the balances into reducer
            - Date ==> Data Obj ==> push(Month Day, Year)
            - Culmination:
                - All the transactions in data added together
            - Reducer is the collection of Culmination => Collection of how balance has changed
            */
            let date = trans["date"]
            const dateString = new Date(date)
            const months = ["Jan.", "Feb.", "March", "April", "May", "June",
                "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

            let cumilation = data.length ? (data.reduce((a, b) => {
                return a + b
            }) + trans["money"]) : trans["money"]
            // console.log(`${months[dateString.getMonth()]} ${dateString.getDate()+1} ,${dateString.getFullYear()}`,cumilation)
            reducer.push(cumilation)
            data.push(trans["money"])
            label.push(`${months[dateString.getMonth()]} ${dateString.getDate() + 1} ,${dateString.getFullYear()}`)
        })


    if (!paid || !requested) return (<h3>Loading...</h3>)
    return (
        <div>
            <p> Change in Balance </p>
            <Line
                data={{
                    labels: label,
                    datasets: [
                        {
                            label: 'Balance',
                            data: reducer,
                            backgroundColor:
                                `${color}`,
                            borderColor:
                                `${color}`,
                            borderWidth: 1,
                        },
                    ],

                }}
                height={400}
                width={550}
                options={{
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: false,
                        },
                        x: {
                            ticks: {
                                display: true,
                                maxTicksLimit: 5,
                            },
                        }
                    },

                    legend: {
                        labels: {
                            fontSize: 100,
                        },
                    },
                }}
            />
        </div>
    )
}

export default ChartData
