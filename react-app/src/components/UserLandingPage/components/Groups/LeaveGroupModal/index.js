import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useState } from "react"

import { useModal } from "../../../../../context/Modal"

import { deleteGroupMemberThunk, deleteGroupThunk, getAllGroupsThunk } from "../../../../../store/groups"

import "./LeaveGroupModal.css"

const LeaveGroupModal = ({ setUpdated, group, deleteGroup }) => {
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
        if (!deleteGroup) {
            dispatch(deleteGroupMemberThunk(group.id, user.id)).then(() => {
                closeModal()
                setUpdated(true)
                history.push('/user/groups/')
                return
            }).catch((res) => {
                setErrors({ "errors": res })

            })
        } else {
            dispatch(deleteGroupThunk(group.id)).then(() => {
                closeModal()
                history.push('/user/groups/')
            }).catch((res) => { return setErrors({ "errors": res }) })
        }
    }

    return (
        <div className="leave-group-modal">
            {submitted && <span className="errors">{errs.errors}</span>}
            {!deleteGroup ? <p>Are you sure you want to leave {group.name}?</p> : <p>Are you sure you want to delete {group.name}?</p>}
            <div className="leave-button-container">
                <button onClick={handleSubmit}>Yes{!deleteGroup ? ", I Want To Leave" : " (Delete Group)"}</button>
                <button onClick={() => closeModal()}>No{!deleteGroup ? ", I Want To Stay" : " (Keep Group)"}</button>
            </div>
        </div>
    )
}

export default LeaveGroupModal
