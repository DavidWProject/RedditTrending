var search = $("#customSearch");

// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    if (data[i].link.substring(0, 3) === "/r/") {
      $("#articles").append("<div class='articles'><p data-id='" + data[i]._id + "'><h3>" + data[i].title + "</h3><br /><span>Posted " + data[i].time + "</span><br /><a href=https://old.reddit.com" + data[i].link + " target=_blank>https://old.reddit.com" + data[i].link + "</a><button class=delete>X</button></p></div>");
    } else {
      $("#articles").append("<div class='articles'><p data-id='" + data[i]._id + "'><h3>" + data[i].title + "</h3><br /><span>Posted " + data[i].time + "</span><br /><a href=" + data[i].link + " target=_blank>" + data[i].link + "</a><button class=delete>X</button></p></div>");

    }
  }
});


// Whenever someone clicks a p tag
$(document).on("click", ".articles", function () {
  // Empty the notes from the note section
  $("#notes").fadeIn();
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).children().attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      $("#notes").append("<h3>" + data.title + "</h3>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      $("#notes-input").html("\n<p> title: " + data + ". </p> \n <p> Note Message: " + data + ".</p>\n")
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// When user clicks the delete button for a note
$(document).on("click", ".delete", function () {
  // Save the p tag that encloses the button
  var selected = $(this).parent();
  selected.remove();
  // Make an AJAX GET request to delete the specific note
  // this uses the data-id of the p-tag, which is linked to the specific note
  // $.ajax({
  //   type: "GET",
  //   url: "/delete/" + selected.attr("data-id"),

  //   // On successful call
  //   success: function (response) {
  //     // Remove the p-tag from the DOM
  //     $(this).parent().hide(); 
  //     selected.remove();
  //     // Clear the note and title inputs
  //   }
  // });
});

// When the #clear-all button is pressed
$(".clear-all").on("click", function () {
  // Make an AJAX GET request to delete the notes from the db
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/clearall",
    // On a successful call, clear the #results section
    success: function (response) {
      location.reload();
    }
  });
});

$(document).on("click", ".refresh", function (e) {

  // $.ajax({
  //   type: "GET",
  //   dataType: "json",
  //   url: "/scrape",
  //   // On a successful call, clear the #results section
  //   success: function (response) {

  //     window.location.href = "/scrape";
  //     setTimeout(function () {
  //       window.location.href = "/";
  //     }, 500);
  //   }
  // });


  //Clear all Wrapper
  $("#articles").empty();
  var searchVal = search.val() || "";
  console.log(searchVal);
  $.getJSON(`/scrape/${searchVal}`, data => {
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      if (data[i].link.substring(0, 3) === "/r/") {
        $("#articles").append("<div class='articles'><p data-id='" + data[i]._id + "'><h3>" + data[i].title + "</h3><br /><span>Posted " + data[i].time + "</span><br /><a href=https://old.reddit.com" + data[i].link + " target=_blank>https://old.reddit.com" + data[i].link + "</a><button class=delete>X</button></p></div>");
      } else {
        $("#articles").append("<div class='articles'><p data-id='" + data[i]._id + "'><h3>" + data[i].title + "</h3><br /><span>Posted " + data[i].time + "</span><br /><a href=" + data[i].link + " target=_blank>" + data[i].link + "</a><button class=delete>X</button></p></div>");
      }
    }

  })


})

// if (window.location.href = "/scrape") {
//   window.location.href = "/"

// }; 

// search.on("keydown", function (e) {

//    var searchVal = search.val();

//    if (e.keyCode === 13) {

// //     //Clear all Wrapper
//      $("#articles").empty();



//      $.getJSON("/articles", function (data) {
//       // For each one
//       for (var i = 0; i < data.length; i++) {
//         // Display the apropos information on the page
//         if (data[i].link.substring(0, 3) === "/r/") {
//           $("#articles").append("<div class='articles'><p data-id='" + data[i]._id + "'><h3>" + data[i].title + "</h3><br /><span>Posted " + data[i].time + "</span><br /><a href=https://old.reddit.com" + data[i].link + " target=_blank>https://old.reddit.com" + data[i].link + "</a><button class=delete>X</button></p></div>");
//         } else {
//           $("#articles").append("<div class='articles'><p data-id='" + data[i]._id + "'><h3>" + data[i].title + "</h3><br /><span>Posted " + data[i].time + "</span><br /><a href=" + data[i].link + " target=_blank>" + data[i].link + "</a><button class=delete>X</button></p></div>");

//         }
//       }
//     });

//     $(".pageStyle1").html(
//       '' + searchVal + '<button class="page-buttons refresh">Refresh Posts</button><button class="page-buttons clear-all">Delete All Posts</button>'
//     );
//     $(".pageStyle1").val(searchVal);

//     $.ajax({
//       type: "GET",
//       dataType: "json",
//       url: "/clearall",
//       // On a successful call, clear the #results section
//       success: function (response) {

//         var scrapeSite = "https://old.reddit.com/r/" + searchVal;

//         axios.get(scrapeSite).then(function (response) {
//           console.log(scrapeSite); 
//             // Then, we load that into cheerio and save it to $ for a shorthand selector
//             var $ = cheerio.load(response.data);
//             console.log("Hello"); 
//             // Now, we grab every h2 within an article tag, and do the following:
//             $("p.title").each(function (i, element) {
//               // Save an empty result object
//               var result = {};

//               // Add the text and href of every link, and save them as properties of the result object
//               result.title = $(element)
//                 .text();
//               result.link = $(element)
//                 .children()
//                 .attr("href");

//               // Create a new Article using the `result` object built from scraping
//               db.Article.create(result)
//                 .then(function (dbArticle) {
//                   // View the added result in the console
//                   console.log(dbArticle);
//                 })
//                 .catch(function (err) {
//                   // If an error occurred, send it to the client
//                   return res.json(err);
//                 });
//             });
//             setTimeout(function () {
//               location.reload(); 
//             }, 500);

//         });

//       }

//     });

//   }

// })

search.on("keydown", function (e) {

  if (e.keyCode === 13) {

    //Clear all Wrapper
    $("#articles").empty();
    var searchVal = search.val() || "";
    console.log(searchVal); 
    $.getJSON(`/scrape/${searchVal}`, data => {
      console.log("DB DATA:", data);
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
       
        if (data[i].link.substring(0, 3) === "/r/") {
          $("#articles").append("<div class='articles'><p data-id='" + data[i]._id + "'><h3>" + data[i].title + "</h3><br /><span>Posted " + data[i].time + "</span><br /><a href=https://old.reddit.com" + data[i].link + " target=_blank>https://old.reddit.com" + data[i].link + "</a><button class=delete>X</button></p></div>");
        } else {
          $("#articles").append("<div class='articles'><p data-id='" + data[i]._id + "'><h3>" + data[i].title + "</h3><br /><span>Posted " + data[i].time + "</span><br /><a href=" + data[i].link + " target=_blank>" + data[i].link + "</a><button class=delete>X</button></p></div>");
        }
      }

    })
  }
});
//   if (e.keyCode === 13) {

//     //Clear all Wrapper
//     $("#articles").empty();

//     $(".pageStyle1").html(
//       '' + searchVal + '<button class="page-buttons refresh">Refresh Posts</button><button class="page-buttons clear-all">Delete All Posts</button>'
//     );
//     $(".pageStyle1").val(searchVal);

//     $.ajax({
//       type: "GET",
//       dataType: "json",
//       url: "/clearall",
//       // On a successful call, clear the #results section
//       success: function (response) {

//         var scrapeSite = "https://old.reddit.com/r/" + searchVal + "/";

//         axios.get(scrapeSite).then(function (response) {
//             // Then, we load that into cheerio and save it to $ for a shorthand selector
//             var $ = cheerio.load(response.data);

//             // Now, we grab every h2 within an article tag, and do the following:
//             $("p.title").each(function (i, element) {
//               // Save an empty result object
//               var {title, link} = element

//               var result = {
//                 title,
//                 link
//               };

//               console.log("result",result);

//               // Add the text and href of every link, and save them as properties of the result object
//               $(element).text(result.title);
//               $(element).children().attr("href") = result.link;

//               // Create a new Article using the `result` object built from scraping
//               db.Article.create(result)
//                 .then(function (dbArticle) {
//                   // View the added result in the console
//                   console.log(dbArticle);
//                 })
//                 .catch(function (err) {
//                   // If an error occurred, send it to the client
//                   return res.json(err);
//                 });
//             });
//             setTimeout(function () {
//               window.location.href = "/";
//             }, 500);

//         });

//       }

//     });

//   }

// })