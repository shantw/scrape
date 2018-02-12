function displayResults() {
    $.getJSON("/scrape", function (scrapeCode) {
        if (scrapeCode.code == "success") {
            $.getJSON("/articles", function (data) {
                $("#ust0").empty();
                $("#ust1").empty();
                $("#ust2").empty();
                $("#total-number").text(data.length);

                for (var i = 0; i < data.length; i++) {
                    var main = $("<div>");
                    main.addClass("card white lighten-2");
                    var contentDiv = $("<div>");
                    contentDiv.addClass("card-content black-text");
                    var spanTitle = $("<span>");
                    spanTitle.addClass("card-title");
                    spanTitle.attr("data-id", data[i]._id);
                    spanTitle.attr("id", "title-" + data[i]._id);
                    spanTitle.text(data[i].title);
                    var p = $("<p>");
                    p.text(data[i].summary);
                    p.attr("id", "summary-" + data[i]._id);
                    contentDiv.append(spanTitle);
                    contentDiv.append(p);
                    var actionDiv = $("<div>");
                    actionDiv.addClass("card-action");
                    var a = $("<a>");
                    a.attr("href", data[i].link);
                    a.attr("id", "link-" + data[i]._id);
                    a.text("Go to the article");
                    actionDiv.append(a);
                    var saveArticleBtn = $("<a>");
                    saveArticleBtn.addClass("btn save-button");
                    saveArticleBtn.attr("id", data[i]._id);
                    saveArticleBtn.text("Save Article");
                    var byline = $("<p>");
                    byline.text(data[i].byline);
                    byline.attr("id", "byline-" + data[i]._id);
                    actionDiv.append(byline);
                    actionDiv.append(saveArticleBtn);
                    main.append(contentDiv);
                    main.append(actionDiv);

                    $("#ust" + String(i % 3)).append(main);
                }
            });
        }
   });
}

$(document).ready(function () {
   // $('.slider').slider();
  //  $(".button-collapse").sideNav();
   // $('.modal').modal();
});