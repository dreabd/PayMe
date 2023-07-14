import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { useModal } from "../../../../../context/Modal"

import { getAllUsersThunk, authenticate } from "../../../../../store/session"
import { postNewGroupThunk, putGroupThunk } from "../../../../../store/groups"

import AddMemberModal from "../AddMemberModal"

import "./NewGroupModal.css"

const NewGroupModal = ({ group }) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { closeModal } = useModal()


    // ---------- State Variables ----------
    const [groupName, setGroupName] = useState(group?.name || "")
    const [isPublic, setIsPublic] = useState(group?.isPublic || false)
    const [ownerId, setOwnerId] = useState(group?.owner_id?.id)
    const [submitted, setSubmitted] = useState(false)
    const [errors, setError] = useState({})

    const current = useSelector(state => state.session.user)
    const users = useSelector(state => state.session.allUsers)

    // ----------- UseEffect ----------
    useEffect(() => {
        const err = {}

        if (groupName.length <= 2) err["groupName"] = "Group Name must be greater 2 characters"
        if (groupName.length >= 30) err["groupName"] = "Group Name must be less than 55 characters"

        setError(err)

        group && dispatch(getAllUsersThunk())

    }, [groupName])

    // ---------- Functions ----------
    const newGroup = async e => {
        e.preventDefault()

        setSubmitted(true)

        if (Object.values(errors).length) return

        const formData = new FormData()

        formData.append("name", groupName.trim())
        formData.append("owner_id", ownerId || current.id)
        formData.append("isPublic", isPublic)

        for (let key of formData.entries()) {
            console.log(key[0] + ' ----> ' + key[1])
        }

        if (!group) {
            const data = await dispatch(postNewGroupThunk(formData))
            if (isNaN(Number(data))) {
                console.log("some errors occured.............", data)
                setError({ "name": data.name[0] })
                return
            }
            closeModal()
            history.push(`/user/group/${data}`)
        }
        else {
            const data = await dispatch(putGroupThunk(group.id, formData))
            if (data) {
                setError({ "name": data })
                return
            }
            dispatch(authenticate(current.id))
            closeModal()
        }

    }

    // console.log(Object.values(errors).length && errors.name)
    // console.log(errors.name)

    return (
        <div className="group-form-container">
            {!group ? <p> Create A New Group</p> : <p>Update Group</p>}
            <form onSubmit={newGroup}>
                {submitted && Object.values(errors).length ? <span className='errors'>{errors.groupName}</span> : null}
                {submitted && Object.values(errors).length ? <span className='errors'>{errors.name}</span> : null}
                <label style={{ display: "flex", flexDirection: "column" }}>
                    Group Name
                    <input
                        type="text"
                        value={groupName}
                        onChange={e => setGroupName(e.target.value)}
                    />
                </label>
                {group &&
                    <label style={{ display: "flex", flexDirection: "column" }} >
                        New Owner
                        <select
                            value={ownerId}
                            onChange={(e) => setOwnerId(e.target.value)}>
                            <option default>Select a User</option>
                            {users && Object.values(group.members).map(user => {
                                if (user.id !== current.id) {
                                    return (
                                        <option key={user.id} value={user.id}>
                                            {user.first_name} {user.last_name}
                                        </option>)
                                } else {
                                    return (null)
                                }
                            })}

                        </select>
                    </label>}
                <label className="public-checkbox">
                    Public
                    <input
                        type="checkbox"
                        value={isPublic}
                        checked={isPublic}
                        onChange={e => { setIsPublic(!isPublic) }}
                    />
                </label>
                {/* 
                Future want to add the abilty to add your group members before creating the group
                {
                    !group &&
                    <AddMemberModal/>
                } */}
                <button className="new-group-button" >Submit</button>

            </form>
        </div>
    )
}

export default NewGroupModal
