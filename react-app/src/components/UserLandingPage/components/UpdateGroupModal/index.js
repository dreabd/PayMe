import { useEffect,useState} from "react"
import { useDispatch,useSelector } from "react-redux"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import NewGroupModal from "../NewGroupModal"

import { getSingleGroupThunk } from "../../../../store/groups"

const UpdateGroupModal = () => {
  const { id } = useParams()
  const dispatch = useDispatch()

  const singleGroup = useSelector(state => state.group.singleGroup)

  useEffect(() => {
    !singleGroup && dispatch(getSingleGroupThunk(id))
  })

  return (<NewGroupModal group={singleGroup}/>)
}

export default UpdateGroupModal
