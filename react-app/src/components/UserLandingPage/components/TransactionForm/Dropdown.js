import React from "react";
import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";

import "./Dropdown.css";

const Icon = () => {
    return (
        <i class="fa-solid fa-caret-down"></i>
    );
};

const Dropdown = ({ trans, current, options, updated, placeHolder,onChange}) => {
    const history = useHistory()
    const location = useLocation()


    if (updated && !trans) history.push('/user/incomplete')

    const [showMenu, setShowMenu] = useState(false)
    const [selectedValue, setSelectedValue] = useState(
        (trans && updated && [trans?.payer.id]) ||
        (location.state?.friend && [location.state.id]) ||
        [])

    const getDisplay = () => {
        if (selectedValue.length === 0) {
            return placeHolder;
        }
        else {
            return (
                <div className="dropdown-tags">
                    {Object.values(selectedValue).map((user) => {
                        // console.log(options)
                        for (let option in options) {
                            if (options[option].id === user) {
                                // console.log("somethign............",user)
                                user = options[option]
                                // console.log(user)
                            }
                        }
                        return (
                            <div key={user.id} className="dropdown-tag-item">
                                {user.first_name} {user.last_name}
                                <span onClick={(e) => onTagRemove(e, user)} className="dropdown-tag-close"><i class="fa-solid fa-xmark"></i></span>
                            </div>
                        )
                    })}
                </div>
            );
        }
    };

    const removeOption = (user) => {
        // console.log("remove option.................",user)
        return selectedValue.filter((users) => users !== user.id);
    };
    const onTagRemove = (e, user) => {
        e.stopPropagation();
        const newValue = removeOption(user);
        setSelectedValue(removeOption(user));
        onChange(newValue)
    };

    const onItemClick = (user) => {
        let newValue;
        // console.log(user)
        // console.log(selectedValue)
        // console.log(selectedValue.findIndex((users) => {
        //     console.log("users...................",users)
        //     console.log("user...................",user)
        //     console.log("boolean..............",users === user.id)
        //     return users === user.id
        // }))
        if (selectedValue.findIndex((users) => users === user.id) >= 0) {
            newValue = removeOption(user);
            // console.log("Remove option......................",newValue)
        } else {
            newValue = [...selectedValue, user.id];
        }
        setSelectedValue(newValue);
        onChange(newValue)
    }

    const isSelected = (user) => {
        return selectedValue.filter((users) => users.id === user.id).length > 0
    }
    const handleInputClick = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu)
    }
    // console.log(showMenu)

    return (
        <div className="dropdown-container">
            <div onClick={handleInputClick} className="dropdown-input">
                <div className="dropdown-selected-value">
                    {getDisplay()}
                    <span className="dropdown-tools" >
                        <Icon />
                    </span>
                </div>
                {showMenu &&
                    <div className="dropdown-menu">
                        {Object.values(options).map(user => {
                            if (user.id !== current.id) {
                                return (
                                    <option
                                        onClick={() => onItemClick(user)}
                                        key={user.id}
                                        className={`dropdown-item ${isSelected(user) && "selected"}`}
                                        value={user.id}>
                                        {user.first_name} {user.last_name}
                                    </option>)
                            } else {
                                return (null)
                            }
                        })}
                    </div>
                }
            </div>
        </div>
    );
};

export default Dropdown;
