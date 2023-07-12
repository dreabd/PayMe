import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { postNewGroupThunk } from "../../../../../store/groups"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useModal } from "../../../../../context/Modal"



const NewGroupModal = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const {closeModal} = useModal()

    
    // ---------- State Variables ----------
    const [groupName, setGroupName] = useState("")
    const [isPublic, setIsPublic] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [errors, setError] = useState({})
    
    const user = useSelector(state => state.session.user)
    // ----------- UseEffect ----------
    useEffect(() => {
        const err = {}

        if (groupName.length <= 2) err["groupName"] = "Group Name must be greater 2 characters"
        if (groupName.length >= 30) err["groupName"] = "Group Name must be less than 55 characters"

        setError(err)
    }, [groupName])

    // ---------- Functions ----------
    const newGroup = async e => {
        e.preventDefault()

        setSubmitted(true)

        if (Object.values(errors).length) return

        const formData = new FormData()

        formData.append("name", groupName.trim())
        formData.append("owner_id", user.id)
        formData.append("isPublic", isPublic)

        const data = await dispatch(postNewGroupThunk(formData))
        console.log("😀.....................",data)
        if (data.errors) {
            console.log("some errors occured.............", data)
            setError(data)
        } else {
            closeModal()
            history.push(`/user/groups/${data}`)
        }

    }

    return (
        <div className="group-form-container">
            <h2> Create A New Group</h2>
            <form onSubmit={newGroup}>
                <label style={{ display: "flex", flexDirection: "column" }}>
                    Group Name
                    {submitted && (<span className='errors'>{errors.groupName}</span> || <span className='errors'>{errors.name}</span>)}
                    <input
                        type="text"
                        value={groupName}
                        onChange={e => setGroupName(e.target.value)}
                    />
                </label>

                <label className="public-checkbox">
                    Public
                    <input
                        type="checkbox"
                        value={isPublic}
                        checked={isPublic}
                        onChange={e => { setIsPublic(!isPublic) }}
                    />
                </label>

                <button className="submit-new-card" >Submit</button>

            </form>
        </div>
    )
}

export default NewGroupModal