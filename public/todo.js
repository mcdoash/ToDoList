let socket = io();
socket.on("buildMasterlist", buildMasterlist);
socket.on("appendList", appendList);
socket.on("setTitle", setTitle);
socket.on("renderList", buildList);
socket.on("appendItem", appendItem);
socket.on("checkItem", checkItem);
socket.on("clearChecked", clearCheckedItems);
socket.on("changeColour", setColour);

let sort = false; //local sorting state

function createList() {
    let form = document.forms["create-list"];
    let name = form["name"].value;

    if(name === "") 
        alert("Please add a valid item.");
    else {
        //hide masterlist and reset form
        document.getElementById("choose-list").style.display = "none";
        document.forms["create-list"].reset();
        socket.emit("createList", {name: name});
    }
}

//open a specific list
function openList(id) {
    document.getElementById("choose-list").style.display = "none";
    socket.emit("setList", id);
}

//leave current list and show the list of lists
function openMasterlist() {
    socket.emit("leaveList");
    document.getElementById("show-list").style.display = "none";

    //clear sort preferences
    document.getElementById("sort").selectedIndex = 0;
    sort = false;

    document.getElementById("choose-list").style.display = "block";
}

//create list of lists from scratch
function buildMasterlist(lists) {
    document.getElementById("masterlist").innerHTML = "";
    lists.forEach( list => {appendList(list);});
}

//add a single list to the masterlist
function appendList(list) {
    let newList = document.createElement("h2");
    newList.setAttribute("onClick", "openList(" + list.id + ")");
    newList.innerText = list.name;
    document.getElementById("masterlist").appendChild(newList);
}

//set the list's title
function setTitle(title) {
    document.getElementById("title").innerText = title;
}


//render entire to-do list of selected list
function buildList(items) {
    document.getElementById("listItems").innerHTML = "";
    items.forEach(item => {appendItem(item);});
    document.getElementById("show-list").style.display = "block";
}

//add a single item to a list
function appendItem(item) {
    let newItem = document.createElement("li");
    newItem.classList.add("item");
    newItem.setAttribute("id", item.id);
    
    if(item.checked) newItem.classList.add("checked");
    
    //create name heading
    let nameElem = document.createElement("h2");
    nameElem.innerText = item.name;
    nameElem.classList.add("name");
    nameElem.setAttribute("onClick", "toggleChecked(this)");
    newItem.appendChild(nameElem);
    
    //build time element if defined
    if(item.totalTime != 0) {
        let timeElem = document.createElement("div");
        timeElem.classList.add("time");

        //build time heading
        let timeText = document.createElement("h2");
        timeText.innerText = item.hours + "h " + item.minutes + "m";
        timeElem.appendChild(timeText);

        //build time icon
        let timeIcon = document.createElement("i");
        timeIcon.classList.add("far", "fa-clock", "fa-lg");
        timeElem.appendChild(timeIcon);

        newItem.appendChild(timeElem);
    }
    newItem.dataset.time = item.totalTime; //time data for sorting

    //build colour changer
    let colourIcon = document.createElement("i");
    colourIcon.classList.add("fas", "fa-tint", "colour-changer");
    newItem.appendChild(colourIcon);

    let colourPicker = document.createElement("input");
    colourPicker.setAttribute("type", "color");
    colourPicker.setAttribute("value", item.colour);
    colourPicker.setAttribute("onchange", "colourChange(this)");
    newItem.appendChild(colourPicker);

    //set item colour
    newItem.style.color = item.colour; 
    newItem.style.borderBottom = "2px solid " + item.colour;
    newItem.dataset.hue = item.hue; //hue data for sorting

    document.getElementById("listItems").appendChild(newItem);
    if(sort) sortItems();
}


//create a new item from form data
function newItem() {
    let form = document.forms["new-item"];
    let name = form["name"].value;

    if(name === "") 
        alert("Please add a valid item.");
    
    else {
        //get form data
        let colour = form["colour"].value;
        let hours = form["hours"].value;
        let minutes = form["minutes"].value;

        //set time to 0 if undefined
        if (hours == "") hours = 0;
        if (minutes == "") minutes = 0;

        let item = {
            name: name,
            hours: hours,
            minutes: minutes,
            totalTime: parseInt(hours * 60) + parseInt(minutes),
            colour: colour,
            hue: getHue(colour),
            checked: false
        };
        document.getElementById("new-item").reset();
        colourIndicator(); //reset colour picker

        socket.emit("addItem", item);
    }
}


//toggle checked status of item
function toggleChecked(item) {
    item = item.parentElement;
    socket.emit("checkItem", item.id);
}

//visually check/uncheck an item
function checkItem(id) {
    document.getElementById(id).classList.toggle("checked");
}


//tell server to clear checked items from list
function clearRequest() {socket.emit("clearChecked");}

//remove all checked elements
function clearCheckedItems() {
    let checkedItems = document.getElementsByClassName("checked");
    checkedItems = [...checkedItems]; //convert to array

    checkedItems.forEach(item => {item.parentNode.removeChild(item);});
}


//sort items according to select value
function sortItems() {
    sort = true;
    let sortType = document.getElementById("sort").value;

    //get list and item elements
    let list = document.getElementById("listItems");
    let items = list.getElementsByTagName("li");
    items = [...items]; //convert to array

    if(sortType === "created") {
        items.sort(function(a, b) {
            if (parseInt(a.id) > parseInt(b.id)) return 1;
            else if (parseInt(a.id) < parseInt(b.id)) return -1;
            return 0;
        });
    }
    else if(sortType.includes("alpha")) {
        items.sort(function(a, b) {
            if (a.textContent.toLowerCase() > b.textContent.toLowerCase()) return 1;
            else if (a.textContent.toLowerCase() < b.textContent.toLowerCase()) return -1;
            return 0;
        });
    }
    else if(sortType.includes("time")) { 
        items.sort(function(a, b) {
            if (parseInt(a.dataset.time) > parseInt(b.dataset.time)) return 1;
            else if (parseInt(a.dataset.time) < parseInt(b.dataset.time)) return -1;
            return 0;
        });
    }
    else if(sortType === "colour") { 
        items.sort(function(a, b) {
            if (parseFloat(a.dataset.hue) > parseFloat(b.dataset.hue)) return 1;
            else if (parseFloat(a.dataset.hue) < parseFloat(b.dataset.hue)) return -1;
            return 0;
        });
    }
    if(sortType.includes("Desc")) {items.reverse();}

    //clear list and append each item in sorted order
    list.innerHTML = ""; 
    items.forEach(item => {list.append(item);});
}

//get the rgb value of a hex colour, from 0-1
function getColourVals(colour) {
    return {red: parseInt(colour.substr(1, 2), 16)/255,
            green: parseInt(colour.substr(3, 2), 16)/255,
            blue: parseInt(colour.substr(5, 2), 16)/255};
}

//return the hue of a hex colour
function getHue(colour) {
    let hue;
    let rgbVals = getColourVals(colour);

    //account for greyscale & prevent NaN
    if(rgbVals.red == rgbVals.green && rgbVals.red == rgbVals.blue) {
        return -2 + rgbVals.red;
    }

    //get the highest and lowest rgb vals
    let max = Math.max(rgbVals.red, rgbVals.green, rgbVals.blue);
    let min = Math.min(rgbVals.red, rgbVals.green, rgbVals.blue);

    if(max === rgbVals.blue) 
        hue = 4 + (rgbVals.red - rgbVals.green)/(max - min);
    if(max === rgbVals.red) 
        hue = (rgbVals.green - rgbVals.blue)/(max - min);
    if(max === rgbVals.green) 
        hue = 2 + (rgbVals.blue - rgbVals.red)/(max - min);

    hue /= 60; //convert to degrees
    if(hue < 0) hue += 360;

    return hue.toFixed(4); //4 decimal points
}

//change new item colour picker to currently selected colour
function colourIndicator() {
    let colourSelect = document.getElementById("colourPicker");
    colourSelect.parentElement.style.color = colourSelect.value;
}

//change item colour
function colourChange(selector) {
    let elem = selector.parentElement;
    socket.emit("changeColour", {id: elem.id, colour: selector.value, hue: getHue(selector.value)});
}

//set the colour styling of an element
function setColour(data) {
    let item = document.getElementById(data.id);
    item.style.color = data.colour; 
    item.style.borderBottom = "2px solid " + data.colour;
    item.dataset.hue = data.hue;
    
    //sort if colour sorting selected
    if(document.getElementById("sort").value === "colour") sortItems();
}