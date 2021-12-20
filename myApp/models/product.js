var mongoose=require("mongoose");

const itemSchema=new mongoose.Schema({
    name:{
        type= String,
        required=true,
        unique=true,
            }
}
)