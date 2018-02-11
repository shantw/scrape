var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var path = require("path");
var app = express();
var logger = require("morgan");

var PORT = process.env.PORT || 3000;

//handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));

app.set("view engine", "handlebars");


//
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("./public"));

// database connection
mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

if(process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
} else {
    mongoose.connect(MONGODB_URI);
}

//mongo connection


var db = mongoose.connection;
db.on('error',function(err){
    console.log('Mongoose Error',err);
});
db.once('open', function(){
    console.log("Mongoose is connected");
});


// Routes

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

//require("./routes/scrape")(app);
require("./routes/html.js")(app);

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});