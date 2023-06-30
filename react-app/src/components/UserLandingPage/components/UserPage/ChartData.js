import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";

import { formatDate } from "../UserTransFeed/TransCard";
import { Line } from 'react-chartjs-2'

export default function ChartData({color}) {

    const paid = useSelector(state => state.transaction.userTransactions.details.stats.trans_paid)
    const requested = useSelector(state => state.transaction.userTransactions.details.stats.trans_requested)
    const user = useSelector(state => state.session.user)

    const userTransactionStats = [...paid, ...requested]
    console.log(userTransactionStats.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.date) - new Date(a.date);
    }))

    const label = []
    const data = []
    const reducer = []

    console.log(user.balance)

    userTransactionStats && userTransactionStats
        .sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.date) - new Date(a.date);
        })
        .forEach(trans => {
            /*
            Pushing in the data into labels and the difference in the balances into reducer
            - Date ==> Data Obj ==> push(Month Day, Year)
            */
            let date = trans["date"]
            const dateString = new Date(date)
            const months = ["Jan.", "Feb.", "March", "April", "May", "June",
                "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

            let cumilation = data.length ? (data.reduce((a,b)=>{
                return a+b
            })+trans["money"] ) : trans["money"]
            console.log(`${months[dateString.getMonth()]} ${dateString.getDate()+1} ,${dateString.getFullYear()}`,trans["money"])
            reducer.push(cumilation)
            data.push(trans["money"])
            label.push(`${months[dateString.getMonth()]} ${dateString.getDate()+1} ,${dateString.getFullYear()}`)
        })


    // console.log(reducer)
    return (
        <div>
            <Line
                data={{
                    labels: label.reverse(),
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
                width={600}
                options={{
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: false,
                        },
                        x: {
                            ticks: {
                                display: true,
                                maxTicksLimit: 6,
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
