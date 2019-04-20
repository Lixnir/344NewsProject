"use strict";
var allRssUrl = "http://www.rssmix.com/u/8316934/rss.xml";
var baseballFootballUrl = "http://www.rssmix.com/u/8316935/rss.xml";
var baseballHockeyUrl = "http://www.rssmix.com/u/8316937/rss.xml";
var hockeyFootballUrl = "http://www.rssmix.com/u/8316936/rss.xml";
var hockeyUrl = "http://www.espn.com/espn/rss/nhl/news";
var baseballUrl = "http://www.espn.com/espn/rss/mbl/news";
var footballUrl = "http://www.espn.com/espn/rss/nfl/news";
var ajaxRequest;
window.onload = function() {
  init(allRssUrl);
};

var jsonUsers = [
  {
    username: "Jordan",
    password: "testing"
  }
];
var favoriteNews = [];

function init(url) {
  //NHL URL for ESPN RSS feed
  console.log("Entering Init");
  document.querySelector("#content").innerHTML = "<b>Loading news...</b>";
  $("#content").fadeOut(250);
  //fetch the data
  $.get(url).done(function(data) {
    xmlLoaded(data);
    console.log(data);
  });
}

function xmlLoaded(obj) {
  console.log("obj =");
  console.log(obj);

  var items = obj.querySelectorAll("item");

  //show the logo
  var image = obj.querySelector("image");
  var logoSrc = image.querySelector("url").firstChild.nodeValue;
  var logoLink = image.querySelector("link").firstChild.nodeValue;
  $("#logo").attr("src", logoSrc);

  //parse the data
  var html = "";
  for (var i = 0; i < items.length; i++) {
    //get the data out of the item
    var newsItem = items[i];
    var title = newsItem.querySelector("title").firstChild.nodeValue;
    console.log(title);
    var description = newsItem.querySelector("description").firstChild
      .nodeValue;
    var link = newsItem.querySelector("link").firstChild.nodeValue;
    var pubDate = newsItem.querySelector("pubDate").firstChild.nodeValue;

    //present the item as HTML
    var line = '<div class="item">';
    line += "<h2>" + title + "</h2>";
    line +=
      "<p><i>" +
      pubDate +
      '</i> - <a href="' +
      link +
      '" target="_blank">See original</a></p>';
    //title and description are always the same (for some reason) so I'm only including one
    //line += "<p>"+description+"</p>";
    line += "</div>";

    html += line;
  }
  document.querySelector("#content").innerHTML = html;

  $("#content").fadeIn(1000);
}

//creats XML request based on the browser
function initAjax() {
  try {
    ajaxRequest = new XMLHttpRequest();
  } catch (e) {
    try {
      ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        // Something went wrong
        alert(
          "Sorry, your browser does not allow Ajax, please use a different browser."
        );
        return false;
      }
    }
  }
}

function loadNewData() {
  initAjax();

  ajaxRequest.onreadystatechange = callBackFunciton;

  // to deal with parameters for the url
  //if (!target) target = document.getElementById("userid");
  //var url = "validate?id=" + escape(target.value);

  ajaxRequest.open("GET", url, true);
  ajaxRequest.send(null);
}

function login() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  var i = 0;
  for (i = 0; i < jsonUsers.length; i++) {
    if (
      jsonUsers[i].username == username &&
      jsonUsers[i].password == password
    ) {
    }
  }
}

function loadJson() {
  var request = new XMLHttpRequest();
  request.open("GET", "users.json");
  request.onreadystatechange = function() {
    if (this.readyState == this.DONE && this.status == 200) {
      if (this.responseText) {
        console.log(this.responseText);
      } else {
        console.log("Error: Data is empty");
      }
    }
  };
  request.send();
}

function saveJson() {
  console.log("saving json");
  var users = JSON.stringify(jsonUsers);
  var request = new XMLHttpRequest();
  var URL = "saveScript.php?data=" + encodeURI(users);
  request.open("GET", URL);
  request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
  request.send();
  while (true) {
    if (request.readyState == 4) {
      console.log("status");
      console.log(request.status);
      break;
    }
  }
  console.log("json saved");
}

saveJson();

loadJson();
