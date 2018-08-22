var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    text: String,
    link: String
});

//mongoose.model needed

var ArticleModel = mongoose.model("Article", ArticleSchema);
 
module.exports = ArticleModel;

