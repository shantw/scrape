var cheerio = require("cheerio");
var request = require("request");

// require the models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
var Save = require("../models/Save");

module.exports = function (app) {

    app.get("/scrape", function (req, res) {
        request("https://www.nytimes.com/", function (error, response, html) {
            
            //https://www.usatoday.com/
            var $ = cheerio.load(html);
            

            $("article.story").each(function (i, element) {
                //console.log(element)
                
                var result = {};
                result.summary = $(element).children("p.summary").text();
                result.byline = $(element).children("p.byline").text();
                result.title = $(element).children("h2").text();
                result.link = $(element).children("h2").children("a").attr("href");
                // Save these results in an object that we'll push into the results array we defined earlier
                if (result.title && result.link) {
                    //console.log(result.title);
                    var entry = new Article(result);
                    //Save
                    Article.update(
                        {link: result.link},
                        result,
                        { upsert: true },
                        function (error, doc){
                            if (error) {
                                console.log(error);
                            }
                        }
                    );
                }
            });
            res.json({"code" : "success"});
        });
    });

    //all the articles
    app.get("/articles", function (req, res) {
        Article.find({}, function (error, document) {
            if (error) {
                console.log(error);
            } else {
                res.send(document);
            }
        });
    });

        //all the articles with id

        app.get("/articles/:id", function (req, res) {
            Article.find({
                    "_id": req.params.id
                })
                .populate("note")
                .exec(function (error, document) {
                    if (error) {
                        console.log(error)
                    } else {
                        res.send(document);
                    }
                });
        });
}