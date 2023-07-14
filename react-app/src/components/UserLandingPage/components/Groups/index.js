import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import OpenModalButton from "../../../OpenModalButton";

import { getAllGroupsThunk } from "../../../../store/groups";

import GroupCard from "./helpers/GroupCard";
import NewGroupModal from "./NewGroupModal";

import "./Group.css"

function Groups() {
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)

    const groups = useSelector(state => state.group.allGroups)
    const userGroups = useSelector(state => state.session.user.my_groups)
    const user = useSelector(state => state.session.user)


    useEffect(() => {
        setTimeout(() => {
            setLoading(true)
        }, 1000)

        dispatch(getAllGroupsThunk())
    }, [])

    if (!loading || !Object.values(groups).length) return (<h4 className="trans-feed-container">Loading...</h4>)

    return (
        <div className="groups-container">
            <div className="public-groups-container">
                <p>Public Groups</p>
                <ul>
                    {Object.values(groups).length && GroupCard(groups, user)}
                </ul>
            </div>

            <div className="user-groups-container">
                <p>My Groups</p>
                <ul>
                    {userGroups.length ? GroupCard(userGroups, user) : "No Groups"}
                </ul>

            </div>


            <div className="add-group-button">
                <OpenModalButton
                    buttonText={"Create Your Own Group"}
                    modalComponent={<NewGroupModal />}
                />
            </div>
        </div>
    )
}

export default Groups
