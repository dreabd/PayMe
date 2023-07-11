import React from "react";
import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";

import { getAllGroupsThunk } from "../../../../store/groups";

import GroupCard from "./components/helpers/GroupCard";

function Groups(){
    const dispatch = useDispatch()
    const groups = useSelector(state => state.group.allGroups)

    const user = useSelector(state => state.session.user)


    useEffect(()=>{
        dispatch(getAllGroupsThunk())
    },[dispatch])


    return (
        <div>
            <h2>Public Groups</h2>
            {Object.values(groups).length && GroupCard(groups,user)}
        </div>
    )
}

export default Groups