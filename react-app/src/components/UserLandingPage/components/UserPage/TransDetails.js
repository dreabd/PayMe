import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

import { TransCard } from "../UserTransFeed/TransCard";
import ChartData from "./ChartData";
import PieData from "./PieData";

import './TransDetails.css'

function TransDetails({ stats, trans, transDetails }) {
    // ------ Use Selectors ------
    const user = useSelector(state => state.session.user)

    // ----- State Variables ------
    const [catDisp, setCatDisp] = useState(false)
    const [balDisp, setBalDisp] = useState(false)
    const [allTrans, setAllTrans] = useState(true)
    const [friendsDisp, setFriendsDisp] = useState(false)

    // ----- Button Logic for Displaying -----
    const onCatDispClick = (e) => {
        setCatDisp(true)
        setBalDisp(false)
        setAllTrans(false)
        setFriendsDisp(false)

    }
    const balDispClick = (e) => {
        setCatDisp(false)
        setBalDisp(true)
        setAllTrans(false)
        setFriendsDisp(false)

    }
    const allTransClick = (e) => {
        setCatDisp(false)
        setBalDisp(false)
        setAllTrans(true)
        setFriendsDisp(false)

    }
    const friendsDispClick = e => {
        setCatDisp(false)
        setBalDisp(false)
        setAllTrans(false)
        setFriendsDisp(true)
    }

    // ----- Components ------
    const friends = user && Object.values(user.friends).sort((a,b)=> {
        if (a.las < b.las )return-1
        else return 1
    }).map(friend => {
        return (
            <li style={{ "listStyleType": "none" }}>
                <NavLink className="navlink important-navlinks" to={`/user/${friend.id}`}>{friend.first_name} {friend.last_name}</NavLink>
            </li>
        )
    })
    console.log(user.friends)

    let color = stats && stats.money_total < 0 ? " #d81159" : "#008cff"
    if (!stats || !trans || !transDetails) return (<h4 className="trans-feed-container">Loading.....</h4>)
    return (
        <div className="user-trans-details">
            {/* Here I want to show all of their transactions */}
            {/* If it is the user's peronsal page then want to show the budget / spending habits */}

            <div className="trans-feed-container ">
                <div className="other-user-info-container">
                    <p>{user.first_name}, {user.last_name}</p>
                    <p className="username">
                        @{user.username}
                    </p>
                </div>

                <div className="trans-details-container">
                    <div className="left-trans-details-container">
                        <nav className="trans-details-button-container">
                            <button onClick={balDispClick}>Balance Changes</button>
                            <button onClick={onCatDispClick}>Categories</button>
                            <button onClick={allTransClick}>Your Transactions</button>
                            <button onClick={friendsDispClick}> My Friends</button>
                            <button onClick={()=>alert("Feature Coming Soon")}> My Bugets</button>
                            <button onClick={()=>alert("Feature Coming Soon")}> My Groups</button>
                        </nav>
                    </div>
                    <div className="right-trans-details-conatiner">
                        {(catDisp || balDisp) ?
                            <div className="top-trans-details-container">
                                <h3>{balDisp && "Balance Details"}</h3>
                                <h3>{catDisp && "Catgeory Details"}</h3>
                            </div>
                            : null
                        }
                        {balDisp &&
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
                            </ul>}
                        {friendsDisp && (friends.length ?
                            <ul className="friends-list">
                                {friends}
                            </ul> :
                            "No Friends...")
                        }
                        <div className="chart-trans-details-contianer">
                            {catDisp && <PieData transDetails={transDetails} />}
                            {balDisp && <ChartData stats={stats} color={color} />}
                            {allTrans && <div className="trans-feed-container">{TransCard(trans, user.id)}</div>}
                            {/* {friendsDisp && null} */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransDetails
