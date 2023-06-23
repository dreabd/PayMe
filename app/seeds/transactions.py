from app.models import db, Transaction, environment, SCHEMA
from sqlalchemy.sql import text
from random import randint, choice,shuffle
from datetime import date

descpt = [
    "Food😫😫😫😫",
    "Drinks🍺🥂🍻",
    "For Fun🥰",
    "Shopppinggg🛒🛒🛒",
    "Treat yourself to some starbies☕☕☕☕",
    "KBBQ🥩🍗🍖🥵",
    "Burgers😋🍔",
    "Mom's Spaghetti🍝🍆💦",
    "Paying off the loan shark🦈💸",
    "Cheers to a new year🎉🎊",
    "Amazonnnn🤐",
    "tolls",
    "lol pay me back pleaseeee😡",
    "Gas🚙",
    "birthday🎂",
    "Concert ticketsss",
    "Dinner with friends 🍕",
    "Thanks for the coffee ☕️",
    "Splitting the bill, thanks!",
    "Happy birthday! 🎉",
    "For the concert tickets 🎵",
    "Rent payment 💰",
    "Owe you for the movie 🎥",
    "Reimbursing for groceries 🛒",
    "Lunch money, thanks! 🥪",
    "For the drinks last night 🍻",
    "Sharing the cab fare 🚖",
    "Thanks for the loan 💸",
    "Gift for you 🎁",
    "Utilities bill payment 💡",
    "Dinner on me tonight 🍽️",
    "Paying back the loan 🤝",
    "Thanks for the help!",
    "Tickets to the game 🏀",
    "Covering my share of rent 🏠",
    "For the gym membership 💪",
    "Repaying the favor 🙌",
    "For the new outfit 👗",
    "Brunch and mimosas 🥂",
    "Thanks for the ride 🚗",
    "Chip in for the gift 🎁",
    "Dinner date, my treat!",
    "Contribution for the party 🎊",
    "For the movie rental 🎬",
    "Tuition payment 💼",
    "Sharing the vacation expenses ✈️",
    "Thanks for covering me!",
    "Reimbursing for the concert 🎤",
    "Paying my share of dinner 🍽️",
    "Money for the pet supplies 🐾",
    "For the weekend getaway 🏖️",
    "Supporting your business venture 📈",
    "Covering the bar tab 🍻",
    "Repaying the IOU 📝",
    "Thanks for the groceries 🛒",
    "Contribution to the charity 🤲",
    "Paying for the spa day 💆",
    "Ticket for the show 🎭",
    "Dinner and a movie 🍽️🎥",
    "For the concert merchandise 🎸",
    "Thanks for the loan, friend 💕",
    "Sharing the cost of repairs 🛠️",
    "Pitching in for the party 🎉",
    "For the new gadget 📱",
    "Covering my share of bills 💡💧",
    "Thanks for the great time!",
    "Contribution for the wedding 💒",
    "Paying back the favor 🙏",
    "Reimbursing for the event tickets 🎟️",
    "For the holiday gifts 🎅",
    "Thanks for the dinner date 🌮",
    "Helping with moving expenses 📦",
    "Supporting your art 🎨",
    "Covering the concert parking 🅿️",
    "Paying for the group trip 🌍",
    "Thanks for the fantastic meal 🍽️",
    "Contributing to the baby shower 👶",
    "Repaying you with gratitude 🙇",
    "For the surprise party supplies 🎊",
    "Pitching in for the group gift 🎁",
    "Thanks for the concert experience 🎵",
    "Helping with the school supplies 🎒",
    "Contributing to the charity run 🏃‍♀️",
    "For the new book 📚",
    "Covering my part of the rent 🏠",
    "Thanks for the theater tickets 🎭",
    "Paying for the yoga class 🧘‍♀️",
    "Supporting your fundraising efforts 🤝",
    "Sharing the cost of groceries 🛒",
    "For the wine and cheese night 🍷🧀",
    "Thanks for the loan, mate 🤝",
    "Contributing to the anniversary gift 💍",
    "Repaying the dinner bill 🍽️",
    "Helping with the car repairs 🚗🔧",
    "Covering my portion of the vacation 🌴",
    "Thanks for the amazing concert night 🎶",
    "For the baby supplies 👶",
    "Pitching in for the surprise trip ✈️",
    "Paying for the cooking class 🍳",
    "Thanks for being there for me!",
    "Contributing to the graduation party 🎓",
    "Repaying the borrowed equipment 📷",
    "For the new running shoes 👟",
    "Supporting your music project 🎵",
    "Covering the cost of dinner 🍽️",
    "Thanks for the friendship and support ❤️",
    "Helping with the home renovation 🏡",
    "Contributing to the team event 🎉",
    "For the new gaming console 🎮",
    "Paying back the shared vacation expenses 🏖️",
    "Thanks for the concert memories 🎤",
    "Sharing the grocery shopping 🛒",
    "For the party decorations 🎊",
    "Pitching in for the concert trip 🚌",
    "Supporting your educational pursuit 📚",
    "Thanks for always being there! 💕",
    ]


def seed_transactions():
    trans_list=[]
    for i in range(0, 10000):
        users = [1,2,3,4,5,6,7,8,9,10]
        shuffle(users)
        trans = Transaction(
            requester_id=users.pop(),
            payer_id=users.pop(),
            description=choice(descpt),
            public=True,
            money=randint(5,50),
            completed=choice([True,False]),
            created_at = date(choice([2023, 2022]), randint(1,6), randint(1, 28)),
            category_id=choice([1,2,3,4,5,6]),
        )
        trans_list.append(trans)

    [db.session.add(trans)for trans in trans_list]
    db.session.commit()


def undo_transactions():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.transactions RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM transactions"))

    db.session.commit()
