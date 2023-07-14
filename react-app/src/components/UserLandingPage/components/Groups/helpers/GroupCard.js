import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { compose } from "redux";

const GroupCard = (groups, user) => {
    const history = useHistory()
    // console.log(groups)
    // console.log(user.id)

    const card = Object.values(groups).map(group => {
        // console.log(group.owner_id.id)
        return (
            <li
                key={group.id}
                onClick={() => history.push(`/user/group/${group.id}`)}
                className="group-card"
                style={{listStyle:"none"}}
            >
                <div className="group-card-top">
                    <p>
                        {group.name}
                    </p>
                    <p>
                        {group.memberCount > 1 ? <span>{group.memberCount}<i class="fa-solid fa-users"></i></span> : <span>{group.memberCount} <i class="fa-solid fa-user"></i></span>}
                    </p>
                </div>
                <div className="group-card-bot">
                    <p className="username">
                        Owner: {group.owner_id.id == user.id ? "You" : group.owner_id.username}
                    </p>
                </div>
            </li>
        )
    })
    return (
        <div className="group-card-container">
            {card}
        </div>
    )
}

export default GroupCard
