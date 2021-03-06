var cheerio = require("cheerio");
var request = require("request");

// require the models

var db = require("../models");

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
                    var entry = new db.Article(result);
                    //Save
                    db.Article.update(
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
        db.Article.find({}, function (error, document) {
            if (error) {
                console.log(error);
            } else {
                res.send(document);
            }
        });
    });

        //all the articles with id

        app.get("/articles/:id", function (req, res) {
            db.Article.find({
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

        // all saved articles
        app.get("/saved/all", function (req, res) {
            db.Save.find({})
                .populate("note")
                .exec(function (error, data) {
                    if (error) {
                        console.log(error);
                        res.json({"code" : "error"});
                    } else {
                        res.json(data);
                    }
                });
        });
    
        // save the article
        app.post("/save", function (req, res) {
            var result = {};
            result.id = req.body._id;
            result.summary = req.body.summary;
            result.byline = req.body.byline;
            result.title = req.body.title;
            result.link = req.body.link;
            
            var entry = new db.Save(result);

            // save that entry to the db
            entry.save(function (err, doc) {
                if (err) {
                    console.log(err);
                    res.json(err);
                }
                // Or log the doc
                else {
                    res.json(doc);
                }
            });
        });

 // route to delete saved articles
 app.delete("/delete", function (req, res) {
    var result = {};
    result._id = req.body._id;
    db.Save.findOneAndRemove({
        '_id': req.body._id
    }, function (err, doc) {
        // Log any errors
        if (err) {
            console.log("error:", err);
            res.json(err);
        }
        // Or log the doc
        else {
            res.json(doc);
        }
    });
});

app.get("/notes/:id", function (req, res) {
    if(req.params.id) {
        db.Note.find({
            "article_id": req.params.id
        })
        .exec(function (error, doc) {
            if (error) {
                console.log(error)
            } else {
                res.send(doc);
            }
        });
    }
});


// Create a new note or replace an existing note
app.post("/notes", function (req, res) {
    if (req.body) {
        var newNote = new db.Note(req.body);
        newNote.save(function (error, doc) {
            if (error) {
                console.log(error);
            } else {
                res.json(doc);
            }
        });
    } else {
        res.send("Error");
    }
});
// find and update the note
app.get("/notepopulate", function (req, res) {
    db.Note.find({
        "_id": req.params.id
    }, function (error, doc) {
        if (error) {
            console.log(error);
        } else {
            res.send(doc);
        }
    });
});

// delete a note

app.delete("/deletenote", function (req, res) {
    var result = {};
    result._id = req.body._id;
    db.Note.findOneAndRemove({
        '_id': req.body._id
    }, function (err, doc) {
        // Log any errors
        if (err) {
            console.log("error:", err);
            res.json(err);
        }
        // Or log the doc
        else {
            res.json(doc);
        }
    });
});

}