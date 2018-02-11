var path = require("path");

module.exports = function (app) {

    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, "views/index.html"));
    });

    app.get("/savedarticles/all", function (req, res) {
        res.sendFile(path.join(__dirname, "views/savedArticles.html"));
    });

    app.get("*", function (req, res) {
        res.sendFile(path.join(__dirname, "views/index.html"));
    });
}