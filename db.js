var mongoose = require("mongoose")
    config = require("./config");

mongoose.connect(config.db);

exports.Entry = mongoose.model("Entry", {
  title:{type:String, required:true},
  amount:{type:Number, required: true}, 
  comment:{type:String, required: true}, 
  category:{type:String, required:true}, 
  createdAt:{type:Date, required: true, default: Date.now}
});
