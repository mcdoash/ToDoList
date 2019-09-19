//event listener for add button
document.getElementById("add").addEventListener("click", addItem);

//event listener for remove button
document.getElementById("remove").addEventListener("click", clearItems);

//event listener for highlight button
document.getElementById("highlight").addEventListener("click", toggleHighlight);



//Adds the item entered by the user to the list
function addItem() {
    //get value of item entered
    var itemName = document.forms["addItem"]["itemName"].value;
    var hours = document.forms["addItem"]["hours"].value;
    var minutes = document.forms["addItem"]["minutes"].value;
    var displayTime = false;
    
    if(hours == "" && minutes == ""){
        var totalTime = 0;
    }
    else {
        if(hours == ""){
            hours = 0;
        }
        else if(minutes == "") {
            minutes = 0;
        }
        var totalTime = hours*60 + minutes;
        displayTime = true;
    }
    
    if(validItem(itemName)) {
        //clear form
        document.getElementById("addItem").reset();
        
        //create new div element to hold all the new item elements
        var newItem = document.createElement("li");
        newItem.classList.add("item");
        newItem.setAttribute("time", totalTime);
        newItem.setAttribute("onClick", "checked(this)");
        
        //create heading for name
        var newItemName = document.createElement("h2");
        
        //add item name to heading
        var newItemText = document.createTextNode(itemName);
        newItemName.appendChild(newItemText);
        
        //add heading to div
        newItem.appendChild(newItemName);
        
        //create and add elements for time
        if(displayTime) {
            //create heading for time
            var timeHeading = document.createElement("h2");

            //add time to heading
            var timeText = document.createTextNode( hours + "h " + minutes + "m");
            timeHeading.appendChild(timeText);
            
            //add clock icon and time value
            newItem.innerHTML += '<i class="far fa-clock fa-lg"></i>';
        newItem.appendChild(timeHeading);
        }
        
        
        
         
        
        //get list and add new item
        var list = document.getElementById("listItems");
        list.appendChild(newItem);
    }
    else {
        //display error box
        alert("Please add a valid item");
    }
}

//checks if an item name is valid
function validItem(itemName) {
    if(itemName != "") {
        return true;
    }
    else {
        return false;
    }
}

function checked(item) {
    item.classList.toggle("checked");
}

//clears all checked items from the list
function clearItems() {
        //create list of all divs with class "checked"
    var checkedItems = document.getElementsByClassName("checked");
    
    //remove every div with a checked box
    while(checkedItems[0]) {
        checkedItems[0].parentNode.removeChild(checkedItems[0]);
    }
}
    

//toggles the higlight of checked items on/off
function toggleHighlight() {
    var checkedItems = document.getElementsByClassName("checked");
    
    for(var i=0; i<checkedItems.length; i++) {
        checkedItems[i].classList.toggle("highlighted");
    }
}


function sortItems(type, directon) {
    
    var swaping, items, swap, a, b;
    var list = document.getElementById("listItems");
    
    do {
        swaping = false;
        items = list.getElementsByTagName("li");
        
        for(var i=0; i<(items.length-1); i++) {
            swap = false;
            
            //if first type (aplhanumerical)
            if(type == 0) {
                //if sorting ascending
                if(directon == 0){
                    a = items[i].textContent;
                    b = items[i+1].textContent;
                }
                //sort descending
                else {
                    b = items[i].textContent;
                    a = items[i+1].textContent;
                }
            }
            //second type (duration)
            else {
                //if sorting ascending
                if(directon == 0){
                    a = items[i].getAttribute("time");
                    b = items[i+1].getAttribute("time");
                }
                //sort descending
                else {
                    b = items[i].getAttribute("time");
                    a = items[i+1].getAttribute("time");
                }
            }
            
            if(a > b) {
                //swap items
                items[i].parentNode.insertBefore(items[i+1], items[i]);
            swaping = true;
                break;
            }
        }
        
    } while(swaping);
}


