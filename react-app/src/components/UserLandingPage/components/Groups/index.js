import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import OpenModalButton from "../../../OpenModalButton";

import { getAllGroupsThunk } from "../../../../store/groups";

import GroupCard from "./helpers/GroupCard";
import NewGroupModal from "./NewGroupModal";

function Groups() {
    const dispatch = useDispatch()

    const [loading,setLoading] = useState(false)

    const groups = useSelector(state => state.group.allGroups)
    const userGroups = useSelector(state => state.session.user.my_groups)
    const user = useSelector(state => state.session.user)


    useEffect(() => {
        setTimeout(()=>{
            setLoading(true)
        },1000)

        dispatch(getAllGroupsThunk())
    }, [])

    if(!loading || !Object.values(groups).length ) return  (<h4 className="trans-feed-container">Loading...</h4>)

    return (
        <div>
            <div className="public-groups-container">
                <h2>Public Groups</h2>
                {Object.values(groups).length && GroupCard(groups, user)}
            </div>

            <div className="user-groups-container">
                <h2>My Groups</h2>
                {userGroups.length ? GroupCard(userGroups, user) : "No Groups"}
            </div>


            <div>
                <OpenModalButton
                    buttonText={<span><i class="fa-solid fa-plus"></i>Create Your Own Group</span>}
                    modalComponent={<NewGroupModal/>}
                />
            </div>
        </div>
    )
}

export default Groups
