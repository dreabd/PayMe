import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { getAllGroupsThunk } from "../../../../store/groups";

import GroupCard from "./helpers/GroupCard";

function Groups() {
    const dispatch = useDispatch()
    const groups = useSelector(state => state.group.allGroups)

    const user = useSelector(state => state.session.user)


    useEffect(() => {
        dispatch(getAllGroupsThunk())
    }, [dispatch])


    return (
        <div>
            <div className="public-groups-container">
                <h2>Public Groups</h2>
                {Object.values(groups).length && GroupCard(groups, user)}
            </div>

            <div className="user-groups-container">
                <h2>My Groups</h2>
                {Object.values(user).length ? GroupCard(Object.values(user.groups), user) : null}
            </div>


            <div>
                <button>
                    <i class="fa-solid fa-plus"></i>Create Your Own Group
                </button>
            </div>
        </div>
    )
}

export default Groups