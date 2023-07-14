import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { NavLink } from "react-router-dom/cjs/react-router-dom.min"

import { useModal } from "../../../../../context/Modal"

import { authenticate, getAllUsersThunk } from "../../../../../store/session"
import { getSingleGroupThunk, postGroupMember } from "../../../../../store/groups"

import "./AddMemberModal.css"

const AddMemberModal = ({ members, group_id }) => {
    const dispatch = useDispatch()
    const { closeModal } = useModal();

    const [error, setError] = useState({})
    const [submitted, setSubmitted] = useState(false)

    const users = useSelector(state => state.session.allUsers)

    if (!Object.values(users).length) {
        dispatch(getAllUsersThunk())
    }

    const member_id = members && Object.keys(members)

    const addNewMember = async (id) => {
        console.log(group_id)
        const res = await fetch(`/api/groups/${group_id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(id)
        })

        if (res.ok) {
            const { newMember } = await res.json()
            dispatch(postGroupMember(newMember))
            dispatch(getSingleGroupThunk(group_id))
            dispatch(authenticate())
            closeModal()
        } else {
            const errors = await res.json()
            setError(errors)
            setSubmitted(true)
        }
    }

    const potential_members = Object.values(users).length ?
        Object.values(users)
            .filter(user => !member_id.includes(String(user.id)))
            .map(user => {
                return (
                    <li className="potential-members-list" style={{ listStyle: "none" }}>
                        <span onClick={() => { addNewMember({ "user_id": user.id }) }}><i className="fa-sharp fa-solid fa-plus"></i></span><p>{user.first_name} {user.last_name}</p>
                    </li>
                )
            })
        : null

    return (
        <div className="potential-members-container">
            <p> Prospective Members</p>
            {submitted && <span className="errors">{error.errors}</span>}
            <ul>
                {potential_members}
            </ul>
        </div>
    )
}

export default AddMemberModal
