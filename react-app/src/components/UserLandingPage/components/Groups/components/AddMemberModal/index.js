import { useDispatch, useSelector } from "react-redux"
import { useHistory,useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useState } from "react"

import { getAllUsersThunk } from "../../../../../../store/session"

import { useModal } from "../../../../../../context/Modal"

import "./AddMemberModal.css"

const AddMemberModal = ({ members,group_id }) => {
    const dispatch = useDispatch()
    const {id} = useParams()
    const { closeModal } = useModal();

    const [error,setError] = useState({})
    const [submitted, setSubmitted] = useState(false)



    const users = useSelector(state => state.session.allUsers)

    if (!Object.values(users).length) {
        dispatch(getAllUsersThunk())
    }

    const potential_members = Object.values(users).length &&
        Object.values(users)
            .filter(user => !members.includes(String(user.id)))
            .map(user => {
                return (
                    <li className="potential-members-list"style={{listStyle:"none"}}>
                        <span onClick={() => {addNewMember({"user_id":user.id})}}><i class="fa-sharp fa-solid fa-plus"></i></span><p>{user.first_name} {user.last_name}</p> 
                    </li>
                )
            })

    

    const addNewMember = async(id) =>{
        console.log(group_id)
        const res = await fetch(`/api/groups/${group_id}`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(id)
        })

        if(res.ok){
            closeModal()
        }
        else{
            const errors  = await res.json()
            setError(errors)
            setSubmitted(true)
        }
    }
    // console.log(potential_members)

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