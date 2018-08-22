

var express = require('express');
var exphbs = require('express-handlebars');
var request = require('request');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
// use this just in case an environment port is supplied
var PORT = process.env.PORT || 3000;
var scrapeUrl = "https://old.reddit.com/r/webdev/";
// var scrapeUrl = "https://azbusinessdaily.com/";

// // If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//Mongoose Models will be grabbed from here
var Article = require("./models/Article");

// // Set mongoose to leverage built in JavaScript ES6 Promises
// // Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);





var app = express();

app.use(express.static("public"));

app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: "main"
}));

app.set('view engine', '.hbs');

app.get("/scrape", function (req, res) {
  request(scrapeUrl, function (err, status, html) {
    var $ = cheerio.load(html);
    $("p.title").each(function (err, elem) {
      var data = {};
      data.text = $(elem).find("a").text();
      data.link = $(elem).find("a").attr("href");

      //need information in mongoose DB
      Article.create(data);
      console.log(elem);
    });
    res.send("articles have been scraped!");
  });
});


app.get("/", function (req, res) {
  Article.find({}).then(function (dbArticles) {
    console.log(dbArticles);
    res.render("index", { articles: dbArticles });
  })
});

app.listen(PORT, function () {
  console.log(`app listening on local host: ${PORT}`)
});

