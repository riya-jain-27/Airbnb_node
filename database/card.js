const getDb = require("./db").getDb;

class Card {
    save(card){
        const db= getDb()
        return db.collection("card").insertOne(card)
    }

    getAllCards(){
        const db = getDb()
        return db.collection("card").find({}).toArray();
    }

    getCard(){

    }

    update(){

    }
}

module.exports = Card;