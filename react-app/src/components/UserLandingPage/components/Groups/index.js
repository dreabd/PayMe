import React from "react";
import { useDispatch,useSelector } from "react-redux";
import { useEffect,useState } from "react";

import { getAllGroupsThunk } from "../../../../store/groups";

function Groups(){
    const dispatch = useDispatch()
    const groups = useSelector(state => state.group.allGroups)

    useEffect(()=>{
        dispatch(getAllGroupsThunk())
    },[dispatch])

    console.log(groups)

    return (
        <div>
            <p>Group Place Holder</p>
        </div>
    )
}

export default Groups