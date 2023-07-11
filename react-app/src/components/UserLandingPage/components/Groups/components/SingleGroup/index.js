import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { NavLink, useParams, useHistory } from "react-router-dom/cjs/react-router-dom.min";

import { getSingleGroupThunk } from "../../../../../../store/groups";
import { GroupTransCard } from "../../../UserTransFeed/TransCard"

import OpenModalButton from "../../../../../OpenModalButton";
import AddMemberModal from "../AddMemberModal";

import './SingleGroup.css'

function GroupPage() {
    const { id } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    const ulRef = useRef();

    // ----------------- State Variable  -----------------
    const [showMenu, setShowMenu] = useState(false);
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(true)


    // ----------------- Use Selectors -----------------
    const singleGroup = useSelector(state => state.group.singleGroup)
    const groupTransactions = useSelector(state => state.transaction.groupTransactions)
    const user = useSelector(state => state.session.user)
    const members = useSelector(state => state.group.groupMembers)

    // console.log("🐽..................................", singleGroup)
    // console.log("🐽..................................", groupTransactions)

    // ----------------- Use Effects -----------------
    useEffect(async () => {
        setTimeout(() => {
            setLoading(false)
        }, 1000);
        let group = await dispatch(getSingleGroupThunk(id))
        group && setErrors({ group })
    }, [id, dispatch])

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

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    if (Object.values(errors).length) {
        history.push("/user/groups")
    }

    const member_id = members && Object.keys(members)

    console.log(member_id)

    if (loading && !Object.values(singleGroup).length) return (<h4 className="trans-feed-container">Loading...</h4>)

    return (
        <div className="trans-feed-container">
            <div className="other-user-info-container">
                <div>
                    <p>{singleGroup.name}</p>
                    <p className="username">
                        Owner: {singleGroup.owner_id?.first_name} {singleGroup.owner_id?.last_name}
                    </p>
                    <button className="members-button" onClick={openMenu}>
                        <i className="fas fa-user-circle" /> {singleGroup.memberCount} Members
                    </button>
                    <ul className={ulClassName} >
                        {
                            Object.values(singleGroup).length &&
                            Object.values(singleGroup.members).map(member => {
                                return (
                                    <li>
                                        <NavLink
                                            className="navlink important-navlinks"
                                            to={`/user/${member.id}`}>
                                            {member.id === singleGroup.owner_id.id && "*"}{member.id === user.id ? "You": <span>{member.first_name} {member.last_name}</span>}
                                        </NavLink>
                                    </li>
                                )
                            })
                        }
                        {singleGroup.owner_id.id === user.id &&
                            <li className="add-member-container">
                                <OpenModalButton
                                    buttonText={<span><i class="fa-sharp fa-solid fa-plus"></i> Add Member</span>}
                                    modalComponent={<AddMemberModal />}
                                    className="members-button"
                                />
                            </li>
                        }
                    </ul>
                </div>




            </div>

            {
                member_id.includes(String(user.id)) ?
                    <div className="all-trans-container">
                        {Object.values(groupTransactions).length && GroupTransCard(Object.values(groupTransactions), user.id)}
                    </div>
                    :
                    "Must be Member to View "
            }
        </div>
    )
}

export default GroupPage