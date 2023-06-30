import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";


import ChartData from "./ChartData";
// import { TransCard } from "../UserTransFeed/TransCard";

function TransDetails({ stats, trans, transDetails }) {

    const user = useSelector(state => state.session.user)
    console.log(stats)

    // console.log(transDetails)
    const categoryDetails = Object.entries(transDetails?.category)?.map(cat => {
        let title = cat[0]
        let details = cat[1]
        console.log(details)
        return (
            <ul>
                {title.toUpperCase()}
                <li style={{ listStyleType: "none" }}>Paid: ${details.money_paid}</li>
                <li style={{ listStyleType: "none" }}>Requested: ${details.money_requested}</li>
                <li style={{ listStyleType: "none" }}>Total: ${details.money_total}</li>
            </ul>
        )
    })

    let color = stats.money_total < 0 ? " #d81159":"#008cff"


    return (
        <div>
            {/* Here I want to show all of their transactions */}
            {/* If it is the user's peronsal page then want to show the budget / spending habits */}

            <div className="trans-feed-container">
                <div className="other-user-info-container">
                    <p>{user.first_name}, {user.last_name}</p>
                    <p className="username">
                        @{user.username}
                    </p>

                </div>
                <div className="all-trans-container">
                    <h3>Transaction Details</h3>
                    <ul className="user-transaction-details">
                        <li style={{ listStyleType: "none" }} >
                            Money paid: ${stats.money_paid}
                        </li>
                        <li style={{ listStyleType: "none" }} >
                            Money requested: ${stats.money_requested}
                        </li>
                        <li style={{ listStyleType: "none" }} >
                            Total: ${stats.money_total}
                        </li>
                    </ul>
                    {/* <h3> Categories </h3>
                    <div>
                        {categoryDetails}
                    </div> */}
                    <ChartData color={color}/>
                </div>
            </div>
        </div>
    )
}

export default TransDetails
