import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink, useParams, useHistory } from "react-router-dom/cjs/react-router-dom.min";

import { getSingleGroupThunk } from "../../../../../store/groups";
import { GroupTransCard } from "../../UserTransFeed/TransCard";

import OpenModalButton from "../../../../OpenModalButton";
import AddMemberModal from "../AddMemberModal";
import LeaveGroupModal from "../LeaveGroupModal";

import './SingleGroup.css'

function GroupPage() {
    const { id } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()

    // ----------------- State Variable  -----------------
    const [showMenu, setShowMenu] = useState(false);
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [updated, setUpdated] = useState(false)


    // ----------------- Use Selectors -----------------
    const singleGroup = useSelector(state => state.group.singleGroup)
    const groupTransactions = useSelector(state => state.transaction.groupTransactions)
    const user = useSelector(state => state.session.user)
    const members = useSelector(state => state.group.groupMembers)

    // console.log("🐽..................................", singleGroup)
    // console.log("🐽..................................", groupTransactions)

    // ----------------- Use Effects -----------------
    useEffect(() => {
        setTimeout(()=>{
            setLoading(true)
        },1000)
        
        const fetchData = async () => {
            setTimeout(() => {
                setLoading(true);
            }, 1000);
            let group = await dispatch(getSingleGroupThunk(id));
            group && setErrors({ group });
        };
        fetchData()

    }, [id, dispatch, updated])

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            setShowMenu(false);
        };

        document.addEventListener("click", closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    // ----------------- Handling Buttons -----------------
    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    const ulClassName = "setting-dropdown" + (showMenu ? "" : " hidden");

    if (Object.values(errors).length) {
        history.push("/user/groups")
    }

    const member_id = members && Object.keys(members)


    if (!loading ) return (<h4 className="trans-feed-container">Loading...</h4>)

    return (
        <div className="trans-feed-container">
            <div className="other-user-info-container">
                <div>
                    <p>{singleGroup.name}</p>
                    <p className="username">
                        Owner: {singleGroup.owner_id?.first_name} {singleGroup.owner_id?.last_name}
                    </p>
                    <button className="members-button" style={{ cursor: "auto" }}>
                        <i className="fas fa-user-circle" />{singleGroup.memberCount} Members
                    </button>

                </div>
                {singleGroup.owner_id.id === user.id ?
                    <div className="group-settings-container">
                        <i onClick={openMenu} class="fa-solid fa-ellipsis"></i>
                        <ul className={ulClassName}>
                            <li>Update</li>
                            <li>Delete</li>
                        </ul>
                    </div> 
                    : null}

            </div>
            <div style={{ justifyContent: "space-between" }} className="trans-details-container">
                {
                    member_id.includes(String(user.id)) ?
                        <div className="all-trans-container">
                            {Object.values(groupTransactions).length ? GroupTransCard(Object.values(groupTransactions), user.id) : "No Transactions"}
                        </div>
                        :
                        <div>
                            Only Members Could View Transacitons
                        </div>
                }
                <div className="member-container">
                    <p>Members</p>
                    <ul >
                        {
                            Object.values(singleGroup).length &&
                            Object.values(members).map(member => {
                                return (
                                    <li key={member.id}>
                                        <NavLink
                                            className="navlink important-navlinks"
                                            to={`/user/${member.id}`}>
                                            {member.id === singleGroup.owner_id.id && "*"}{member.id === user.id ? "You" : <span>{member.first_name} {member.last_name}</span>}
                                        </NavLink>
                                    </li>
                                )
                            })
                        }
                        {singleGroup.owner_id.id === user.id &&
                            <li className="add-member-container">
                                <OpenModalButton
                                    buttonText={<span><i className="fa-sharp fa-solid fa-plus"></i> Add Member</span>}
                                    modalComponent={<AddMemberModal members={members} group_id={id} />}
                                />
                            </li>
                        }
                        {
                            member_id.includes(String(user.id)) && user.id !== singleGroup.owner_id.id &&

                            <li className="leave-group-container">
                                <OpenModalButton
                                    buttonText="Leave Group"
                                    modalComponent={<LeaveGroupModal setUpdated={setUpdated} group={singleGroup} />}
                                />
                            </li>
                        }
                    </ul>
                </div>

            </div>


        </div>
    )
}

export default GroupPage