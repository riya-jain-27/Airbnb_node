const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(
        "mongodb+srv://admin:admin@cluster-0.sayd9.mongodb.net/airbnb_db?retryWrites=true&w=majority"
    ).then((result)=>{
        callback(result)
        _db=result.db();
        console.log("connection established")
    }).catch((err)=>{
        console.log(err)
    })
}

const getDb =() => {
    if(_db){
        return _db
    }
    throw "No database connected!"
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;