import { NavLink } from "react-router-dom";

export const formatDate = (dateString) => {
    if (!dateString) return;
    const date = new Date(dateString)
    return date.toLocaleString();
}

export const TransCard = (transactions, id) => {
    return transactions.sort(function (a, b) {
        return new Date(b.created_at) - new Date(a.created_at);
    })
        .map(trans => {
            // console.log(trans)
            // console.log(id)
            return (
                <div key={trans.id} className="trans-card">
                    <div className="left-trans">
                        <div className="top-trans">
                            {trans.payer.id === id ? "You" : <NavLink className="navlink important-navlinks" to={`/user/${trans.payer.id}`}>{trans.payer.first_name} {trans.payer.last_name}</NavLink>} <span>paid</span> {trans.requester.id === id ? "You" : <NavLink className="navlink important-navlinks" to={`/user/${trans.requester.id}`}>{trans.requester.first_name} {trans.requester.last_name}</NavLink>}
                        </div>
                        <div className="mid-trans">
                            {formatDate(trans.created_at)}
                        </div>
                        <div className="bot-trans">
                            {trans.description}
                        </div>
                    </div>

                    <div className="right-trans">
                        {(trans.payer_id === id || trans.requester_id === id) ? trans.requester_id === id ? <span className="positive-trans">+${trans.money}</span> : trans.payer_id === id ? <span className="negative-trans">-${trans.money}</span> : null : null}
                    </div>

                </div>
            )
        }
        )
}


export const GroupTransCard = (transactions, id) => {
    return transactions.sort(function (a, b) {
        return new Date(b.created_at) - new Date(a.created_at);
    })
        .map(trans => {
            // console.log(trans)
            // console.log(id)
            return (
                <div key={trans.id} className="trans-card">
                    <div className="left-trans">
                        <div className="top-trans">
                            {trans.payer.id === id ? "You" : <NavLink className="navlink important-navlinks" to={`/user/${trans.payer.id}`}>{trans.payer.first_name} {trans.payer.last_name}</NavLink>} <span>paid</span> {trans.requester.id === id ? "You" : <NavLink className="navlink important-navlinks" to={`/user/${trans.requester.id}`}>{trans.requester.first_name} {trans.requester.last_name}</NavLink>}
                        </div>
                        <div className="mid-trans">
                            {formatDate(trans.created_at)}
                        </div>
                        <div className="bot-trans">
                            {trans.description}
                        </div>
                    </div>

                    <div className="right-trans">
                        {
                        (trans.payer_id === id || trans.requester_id === id) ? 
                            trans.requester_id === id 
                                ? <span className="positive-trans">+${trans.money}</span> 
                                : trans.payer_id === id ? <span className="negative-trans">-${trans.money}</span> 
                            : null : <span className="group-trans">${trans.money}</span>}
                    </div>

                </div>
            )
        }
        )
}