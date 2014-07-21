var SVGNS = "http://www.w3.org/2000/svg";

var Template = function(resumeDiv, resumeWidth){
  this.resumeWidth = resumeWidth || 800;
  this.titleHight = 120;
  this.curLeftHeight = 0;
  this.curRightHeight = 0;
  this.colors = {};
  this.fonts = {};
  this.fontSize = {
    "resumeTitle" : "70px",
    "eventTitle" : "25px",
    "eventItem" : "18px"
  };
  this.fontColor = {
    "resumeTitle" : "white",
    "eventTitle" : "gray"
  };
  this.init(resumeDiv);
};

Template.prototype.init = function(resumeDiv){
  var that = this;
  this.leftIndent = (window.innerWidth - this.resumeWidth) / 2;
  this.canvas = document.createElementNS(SVGNS, 'svg');
  this.canvas.style["border"] = "";
  if(resumeDiv === null || resumeDiv === undefined){
    this.resumeDiv = document.createElement("div");
    this.resumeDiv.setAttribute("id", "resume");
    document.body.appendChild(this.resumeDiv);
  }
  else{
    this.resumeDiv = resumeDiv;
  }
  this.resumeDiv.appendChild(this.canvas);
  document.addEventListener( "DOMContentLoaded", function(){
    that._fixLayout(that.canvas);
  });
};

Template.prototype._addStyle = function(element, styleName, styleValue){
  var re = new RegExp(styleName + "\\([0-9]*[a-z]*\\)?", "g");
  if(element.style["-webkit-transform"].indexOf(styleName) !== -1){
    element.style["-webkit-transform"] = element.style["-webkit-transform"].replace(re, styleName + "(" + styleValue + ")");
  }
  else{
    element.style['-webkit-transform'] += styleName + "(" + styleValue + ")";
  }
};

Template.prototype._setInitAnimation = function(element){
  var that = this;
  element.style["-webkit-transition"] = "0.5s";
  this._addStyle(element, "scale", 0);
  setTimeout(function(){
    that._addStyle(element, "scale", 1);
  }, 500);
};

Template.prototype.addTitle = function(title){
  var titleG = document.createElementNS(SVGNS, 'g');
  var titleRect = document.createElementNS(SVGNS, 'path');
  var titleText = document.createElementNS(SVGNS, 'text');

  this._setInitAnimation(titleG);

  titleRect.setAttribute("d", "m 0 0 " +
			 "l " + this.resumeWidth + " 0 " +
			 "l " + "0 " + this.titleHight + " " +
			 "l " + "-" + this.resumeWidth + " 0 " +
			 "z");
  titleRect.style["fill"] = "black";
  titleText.textContent = title;
  titleText.setAttribute("x", this.resumeWidth / 2);
  titleText.setAttribute("y", -30);
  titleText.style["text-anchor"] = "middle";
  titleText.style["fill"] = this.fontColor["resumeTitle"];
  titleText.style["font-size"] = this.fontSize["resumeTitle"];
  titleG.appendChild(titleRect);
  titleG.appendChild(titleText);
  this.canvas.appendChild(titleG);

  this.curLeftHeight += this.titleHight;
  this.curRightHeight += this.titleHight;
};

Template.prototype.addEventList = function(eventList){
  var eventListG = document.createElementNS(SVGNS, 'g');
  var eventListTitle = document.createElementNS(SVGNS, "text");
  var eventDivideLine = this._createDivideLine(this.resumeWidth / 2);
  var eventItems = this._createEventItem(eventList.eventItem);

  this._setInitAnimation(eventListG);

  eventListTitle.textContent = eventList.title;
  eventListTitle.style["font-size"] = this.fontSize["eventTitle"];
  eventListTitle.style["fill"] = this.fontColor["eventTitle"];
  eventListTitle.style["text-anchor"] = "start";
  eventListG.appendChild(eventListTitle);
  eventListG.appendChild(eventDivideLine);
  eventItems.forEach(function(item){
    eventListG.appendChild(item);
  });

  this.canvas.appendChild(eventListG);
};

Template.prototype._createDivideLine = function(length, color){
  var divideLine = document.createElementNS(SVGNS, "path");

  divideLine.setAttribute("d", "m 0 0 " + "l " + length + " 0");
  divideLine.style["stroke"] = color || "#999999";
  divideLine.style["stroke-width"] = 2;

  return divideLine;
};

Template.prototype._createEventItem = function(eventItem){
  var that = this;
  var eventItemG = [];
  eventItem.forEach(function(item){
    var itemTitle = document.createElementNS(SVGNS, 'text');
    itemTitle.textContent = item.title;
    itemTitle.style["font-size"] = that.fontSize["eventItem"];
    eventItemG.push(itemTitle);
    var dividline1 = that._createDivideLine(that.resumeWidth / 8);
    eventItemG.push(dividline1);
    var itemTime = document.createElementNS(SVGNS, 'text');
    itemTime.textContent = item.time;
    itemTime.style["font-size"] = that.fontSize["eventItem"];
    eventItemG.push(itemTime);
    var dividlineItem = that._createDivideLine(that.resumeWidth / 4);
    eventItemG.push(dividlineItem);
  });
  return eventItemG;
};

Template.prototype._fixLayout = function(element){
  var that = this;
  var children = element.childNodes;
  var height = 0;
  for(var i = 0; i < children.length; ++i){
    if(children[i].tagName === "text"){
      var yValue = isNaN(parseInt(children[i].getAttribute("y"))) ? 0 : parseInt(children[i].getAttribute("y"));
      children[i].setAttribute("y", yValue + height);
    }
    else{
      this._addStyle(children[i], "translateY", height + "px");
    }
    height += children[i].getBBox().height;
    if(children[i].tagName === "g"){
      this._addStyle(children[i], "translateX", this.leftIndent + "px");
      this._fixLayout(children[i]);
    }
  }
};
