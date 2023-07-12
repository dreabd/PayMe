import { useDispatch, useSelector } from "react-redux"
import { useHistory,Redirect } from "react-router-dom/cjs/react-router-dom.min"
import { useState } from "react"

import { useModal } from "../../../../../context/Modal"

import { deleteGroupMemberThunk, getAllGroupsThunk, getSingleGroupThunk } from "../../../../../store/groups"

import "./LeaveGroupModal.css"

const LeaveGroupModal = ({ setUpdated, group }) => {
    const dispatch = useDispatch()
    const { closeModal } = useModal()
    const history = useHistory()

    const [errs, setErrors] = useState({})
    const [submitted, setSubmitted] = useState(false)

    const user = useSelector(state => state.session.user)

    console.log(user)

    const handleSubmit = async e => {
        e.preventDefault()
        setSubmitted(true)
        let res = await dispatch(deleteGroupMemberThunk(group.id, user.id))
        if (res) {
            return setErrors({ "errors": res })
        } else {
            closeModal()
            // dispatch(getSingleGroupThunk(group.id))
            // dispatch(getAllGroupsThunk())
            setUpdated(true)
            return <Redirect to="/user/groups" />
        }
    }

    console.log(errs)

    return (
        <div className="leave-group-modal">
            {submitted && <span className="errors">{errs.errors}</span>}
            <p>Are you sure you want to leave {group.name}?</p>
            <div className="leave-button-container">
                <button onClick={handleSubmit}>Yes, I Want To Leave</button>
                <button onClick={() => closeModal()}>No, I Want To Stay</button>
            </div>
        </div>
    )
}

export default LeaveGroupModal