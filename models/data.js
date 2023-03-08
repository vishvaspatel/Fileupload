const mongoose = require("mongoose");

const data= new mongoose.Schema(
    {
        Filename:{
            type : String
        },
        Path:{
            type : String
        }
    }
);

const Data = mongoose.model("data", data);

module.exports = Data;