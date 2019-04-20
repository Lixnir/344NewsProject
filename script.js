"use strict";
var allRssUrl = "http://www.rssmix.com/u/8316934/rss.xml";
var baseballFootballUrl = "http://www.rssmix.com/u/8316935/rss.xml";
var baseballHockeyUrl = "http://www.rssmix.com/u/8316937/rss.xml";
var hockeyFootballUrl = "http://www.rssmix.com/u/8316936/rss.xml";
var hockeyUrl = "http://www.espn.com/espn/rss/nhl/news";
var baseballUrl =
  "https://api.foxsports.com/v1/rss?partnerKey=zBaFxRyGKCfxBagJG9b8pqLyndmvo7UU";
var footballUrl = "http://www.espn.com/espn/rss/nfl/news";
var ajaxRequest;
window.onload = function() {
  initStart();
};

function toggleHockey() {
  var news = document.getElementsByClassName("hockey");
  var set = "";
  if (!document.getElementById("hockey").checked) {
    set = "none";
  } else {
    set = "inherit";
  }
  for (let item of news) {
    item.style.display = set;
  }
}

function toggleBaseball() {
  var news = document.getElementsByClassName("baseball");
  var set = "";
  if (!document.getElementById("baseball").checked) {
    set = "none";
  } else {
    set = "inherit";
  }
  for (let item of news) {
    item.style.display = set;
  }
}

function toggleFootball() {
  var news = document.getElementsByClassName("football");
  var set = "";
  if (!document.getElementById("football").checked) {
    set = "none";
  } else {
    set = "inherit";
  }
  for (let item of news) {
    item.style.display = set;
  }
}

var jsonUsers = [
  {
    username: "Jordan",
    password: "testing"
  }
];
var favoriteNews = [];

function initStart(url) {
  console.log("Entering Init");
  document.querySelector("#content").innerHTML = "<b>Loading news...</b>";
  $("#content").fadeOut(250);
  //fetch the data
  $.get(hockeyUrl).done(function(data) {
    let array = parseXml(data);
    array.forEach(function(item) {
      item.sport = "hockey";
    });
    initBaseball(array);
  });
}

function initBaseball(previousData) {
  console.log("Entering Init");
  document.querySelector("#content").innerHTML = "<b>Loading news...</b>";
  $("#content").fadeOut(250);
  //fetch the data
  $.get(baseballUrl).done(function(data) {
    let array = parseXml(data);
    array.forEach(function(item) {
      item.sport = "baseball";
    });
    tempData = array.concat(previousData);
    tempData.sort(function(a, b) {
      a = new Date(a.pubDate);
      b = new Date(b.pubDate);
      return a > b ? -1 : a < b ? 1 : 0;
    });
    initFootball(tempData);
  });
}

function initFootball(previousData) {
  console.log("Entering Init");
  document.querySelector("#content").innerHTML = "<b>Loading news...</b>";
  $("#content").fadeOut(250);
  //fetch the data
  $.get(footballUrl).done(function(data) {
    let array = parseXml(data);
    array.forEach(function(item) {
      item.sport = "football";
    });
    tempData = array.concat(previousData);
    tempData.sort(function(a, b) {
      a = new Date(a.pubDate);
      b = new Date(b.pubDate);
      return a > b ? -1 : a < b ? 1 : 0;
    });
    xmlLoaded(tempData);
  });
}

function parseXml(obj) {
  var items = obj.querySelectorAll("item");

  //parse the data
  var data = [];
  for (var i = 0; i < items.length; i++) {
    //get the data out of the item
    var newsItem = items[i];
    var title = newsItem.querySelector("title").firstChild.nodeValue;
    console.log(title);
    var description = newsItem.querySelector("description").firstChild
      .nodeValue;
    var link = newsItem.querySelector("link").firstChild.nodeValue;
    var pubDate = newsItem.querySelector("pubDate").firstChild.nodeValue;

    data.push({
      newsItem,
      title,
      description,
      link,
      pubDate
    });
  }
  return data;
}

function xmlLoaded(items) {
  //parse the data
  var html = "";
  for (var i = 0; i < items.length; i++) {
    //present the item as HTML
    var line = '<div class="item ' + items[i].sport + '" >';
    line += "<h2>" + items[i].title + "</h2>";
    line +=
      "<p><i>" +
      items[i].pubDate +
      '</i> - <a href="' +
      items[i].link +
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

  console.log("user " + username);
  console.log("pass " + password);

  var i = 0;
  for (i = 0; i < jsonUsers.length; i++) {
    if (
      jsonUsers[i].username == username &&
      jsonUsers[i].password == password
    ) {
      document.getElementById("login").style.display = "none";
      document.getElementById("allContent").style.display = "inherit";
    }
  }
  if (
    document.getElementById("login").style.display != "none" &&
    confirm(
      "Your username and/or password is wrong, would you like to create a user with these credentials?"
    )
  ) {
    jsonUsers.push({
      username: username,
      password: password
    });
    saveJson();
    document.getElementById("login").style.display = "none";
    document.getElementById("allContent").style.display = "inherit";
  }
}

function loadJson() {
  var request = new XMLHttpRequest();
  request.open("GET", "users.json");
  request.onreadystatechange = function() {
    if (this.readyState == this.DONE && this.status == 200) {
      if (this.responseText) {
        jsonUsers = JSON.parse(this.responseText);
        console.log(jsonUsers);
      } else {
        console.log("Error: Data is empty");
      }
    }
  };
  request.send();
}

function saveJson() {
  var users = JSON.stringify(jsonUsers);
  var request = new XMLHttpRequest();
  var URL = "saveScript.php?data=" + encodeURI(users);
  request.open("GET", URL);
  request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
  request.send();
}

loadJson();
