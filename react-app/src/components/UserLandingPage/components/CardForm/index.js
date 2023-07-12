import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { postNewCardThunk, putCardThunk } from "../../../../store/cards";

function CardForm({update,card}) {
  const dispatch = useDispatch()
  const history = useHistory()

  const [bankName, setBankName] = useState(card?.bank_name||"")
  const [cardNumber, setCardNumber] = useState(String(card?.card_number) || "")
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  // console.log("😂..................................",card)

  useEffect(() => {
    const err = {}

    const validBanks = ["AMEX", "VISA", "DISCOVER", "MASTERCARD"]
    if (!bankName.length) err["bankName"] = "Please provide a valid bank"
    if (bankName.length && !validBanks.includes(bankName.toUpperCase())) err["bankName"] = "AMEX,VISA,DISCOVER or MASTERCARD"
    if (cardNumber.length < 15 && cardNumber.length > 16) err["cardNumber"] = "Please provide a valid card."
    if (bankName === "AMEX" && cardNumber.length !== 15) err["cardNumber"] = "AMEX card invalid."
    if (bankName !== "AMEX" && cardNumber.length !== 16) err["cardNumber"] = "Card number invalid."

    setErrors(err)

  }, [bankName, cardNumber])

  const addCard = async e => {
    e.preventDefault()

    setSubmitted(true)

    if (Object.values(errors).length) return
    // console.log("no errors..................")
    const formData = new FormData()
    formData.append("bank_name",bankName)
    formData.append("card_number",Number(cardNumber))

    const data = await dispatch(postNewCardThunk(formData))
    if(data){
      // console.log("some errors occured.............",data)
      setErrors(data)
    } else{
      history.push("/user/cards")
    }
  }

  const updateCard = async e =>{
    e.preventDefault()

    setSubmitted(true)

    if (Object.values(errors).length) return

    const formData = new FormData()
    formData.append("bank_name",bankName)
    formData.append("card_number",Number(cardNumber))

    const data = await dispatch(putCardThunk(card.id,formData))
    if(data){
      console.log("some errors occured.............",data)
      setErrors(data)
    } else{
      history.push("/user/cards")
    }
  }

  function noWhiteSpaceOrLetters(value) {
      if (bankName === "AMEX"){
      const v = value
        .replace(/\s+/g, "")
        .replace(/[^0-9]/gi, "")
        .substr(0, 15);

      return v
    }
    else{
      const v = value
      .replace(/\s+/g, "")
      .replace(/[^0-9]/gi, "")
      .substr(0, 16);

    return v
    }
  }
  return (
    <div className="card-form-container">
      <form onSubmit={!update ? addCard : updateCard } className="card-form">
        <label style={{ display: "flex", flexDirection: "column" }}>
          Bank Name
          {submitted && <span className='errors'>{errors.bankName}</span>}
          <input
            type="text"
            value={bankName}
            onChange={e => setBankName(e.target.value.toUpperCase())}
          />
        </label>
        <label  style={{ display: "flex", flexDirection: "column" }} >
          Credit Card Number
          {submitted && <span className='errors'>{errors.cardNumber}</span>}
          {submitted && <span className='errors'>{errors.card_number}</span>}
          <input
            type="text"
            autoFocus
            placeholder="Card Number"
            maxLength={bankName==="AMEX"? 15 : 16}
            value={noWhiteSpaceOrLetters(cardNumber)}
            onChange={e => setCardNumber(e.target.value)}
          />
        </label>
        {!update ?<button className="submit-new-card" >Submit</button> : <button className="update-card">Update</button>}
      </form>
    </div>
  )
}

export default CardForm
