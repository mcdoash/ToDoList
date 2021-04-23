let listItems = [];
let id = 0;
let sort = false;

//create a new item from form data and add to the list
function newItem() {
    let form = document.forms["new-item"];
    let name = form["name"].value;
    
    if(name === "") {
        alert("Please add a valid item.");
    }
    else {
        //get form data
        let colour = form["colour"].value;
        let hours = form["hours"].value;
        let minutes = form["minutes"].value;

        //set time to 0 if undefined
        if (hours == "") hours = 0;
        if (minutes == "") minutes = 0;

        if(!colour) colour = "#999"; //set to default
        
        let item = {
            id: id,
            name: name,
            hours: hours,
            minutes: minutes,
            totalTime: parseInt(hours * 60) + parseInt(minutes),
            colour: colour,
            checked: false
        };
        listItems.push(item);
        document.getElementById("new-item").reset();
        colourIndicator(); //reset colour picker

        id++; //increase item id
        buildList();
    }
}

//render to-do list
function buildList() {
    let list = document.getElementById("listItems");
    list.innerHTML = ""; //clear

    if(sort) sortItems();

    //build each list item
    listItems.forEach(function(item) {
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

        //build colour changer
        let colourIcon = document.createElement("i");
        colourIcon.classList.add("fas", "fa-tint", "colour-changer");
        newItem.appendChild(colourIcon);

        let colourPicker = document.createElement("input");
        colourPicker.setAttribute("type", "color");
        colourPicker.setAttribute("value", item.colour);
        colourPicker.setAttribute("onchange", "colourChange(this)");
        newItem.appendChild(colourPicker);
        setColour(newItem, item);

        list.appendChild(newItem);
    });
}

//toggle checked status of item
function toggleChecked(item) {
    item = item.parentElement;
    item.classList.toggle("checked");

    //find item in list
    let entry = listItems.find(a => {return a.id == item.id});
    entry.checked = !entry.checked; //toggle state
}


//clear all checked items from list
function clearItems() {
    listItems = listItems.filter(item => !item.checked);
    buildList();
}


//sort items according to select value
function sortItems() {
    sort = true;
    let sortType = document.getElementById("sort").value;

    //sort by when item was adding
    if(sortType === "created") {
        listItems.sort(function(a, b) {
            if (a.id > b.id) return 1;
            else if (a.id < b.id) return -1;
            return 0;
        });
    }
    //sort alphanumerically 
    else if(sortType.includes("alpha")) {
        listItems.sort(function(a, b) {
            if (a.name > b.name) return 1;
            else if (a.name < b.name) return -1;
            return 0;
        });
    }
    //sort by time
    else if(sortType.includes("time")) {
        listItems.sort(function(a, b) {
            if (a.totalTime > b.totalTime) return 1;
            else if (a.totalTime < b.totalTime) return -1;
            return 0;
        });
    }
    //sort by colour
    else if(sortType === "colour") {
        listItems.sort(function(a, b) {
            if (a.colour > b.colour) return 1;
            else if (a.colour < b.colour) return -1;
            return 0;
        });
    }
    //change to high to low
    if(sortType.includes("Desc")) {
        listItems.reverse();
    }
}

//change new item colour picker to currently selected colour
function colourIndicator() {
    let colourSelect = document.getElementById("colourPicker");
    colourSelect.parentElement.style.color = colourSelect.value;
}

//change item colour
function colourChange(selector) {
    let elem = selector.parentElement;

    //find item in list and change value
    let item = listItems.find(a => {return a.id == elem.id});
    item.colour = selector.value;
    setColour(elem, item);

    if(sort) {
        sortItems();
        buildList();
    }
}

//set the colour styling of an item
function setColour(item, data) {
    item.style.color = data.colour; 
    item.style.borderBottom = "2px solid " + data.colour;
}