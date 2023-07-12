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
            <div
                key={group.id}
                onClick={() => history.push(`/user/group/${group.id}`)}
            >
                <h3>
                    {group.name}
                </h3>
                <p>
                    {group.memberCount} Members
                </p>
                <p>
                    Owner: {group.owner_id.id == user.id ? "You" : group.owner_id.username}
                </p>
            </div>
        )
    })
    return (
        <div className="group-card-container">
            {card}
        </div>
    )
}

export default GroupCard
