//event listener for add button
document.getElementById("add").addEventListener("click", addItem);

//event listener for remove button
document.getElementById("remove").addEventListener("click", clearItems);

//event listener for colour picker
document.getElementById("colourPicker").addEventListener("change", colourChange);


//addItem function adds the item entered by the user to the list
function addItem() {
    //get value of item name entered
    var name = document.forms["addItem"]["itemName"].value;
    
    //check if name if valid before continuing
    if(validItem(name)) {
        //get the remainder of item values
        var colour = document.forms["addItem"]["colour"].value;
        var hours = document.forms["addItem"]["hours"].value;
        var minutes = document.forms["addItem"]["minutes"].value;

        //determine if time should be displayed
        var displayTime = false;
        if(hours == "" && minutes == ""){ //both values empty
            var totalTime = 0;
        }
        else {
            if(hours == ""){
                hours = 0;
            }
            else if(minutes == "") {
                minutes = 0;
            }
            var totalTime = hours*60 + minutes; //create total time (in minutes) for sorting later on
            displayTime = true;
        }
        
        //clear form
        document.getElementById("addItem").reset();
        colourChange(); //reset colour picker icon colour
        
        //create new div element to hold all the new item elements
        var newItem = document.createElement("li");
        newItem.classList.add("item");
        newItem.setAttribute("time", totalTime); //set values entered for easy sorting later
        newItem.setAttribute("colour", colour);
        newItem.setAttribute("onClick", "checked(this)"); //check off item when clicked
        
        
        var nameHeading = document.createElement("h2"); //create heading for name
        //add item name to heading
        var nameText = document.createTextNode(name);
        nameHeading.appendChild(nameText);
        
        newItem.appendChild(nameHeading); //add heading to div
        
        //create and add elements for time, if needed
        if(displayTime) {
            var timeHeading = document.createElement("h2"); //create heading for time

            //add time to heading
            var timeText = document.createTextNode( hours + "h " + minutes + "m");
            timeHeading.appendChild(timeText);
            
            //add clock icon
            newItem.innerHTML += '<i class="far fa-clock fa-lg"></i>';
            newItem.appendChild(timeHeading);
        }
        
        //change colour
        newItem.style.color = colour; //icon colour
        newItem.firstChild.style.color = colour; //text colour
        newItem.style.borderBottom = "2px solid " + colour; //border colour
        
        //get list and add new item
        var list = document.getElementById("listItems");
        list.appendChild(newItem);
    }
    //item name entered was not valid
    else {
        //display error box
        alert("Please add a valid item.");
    }
}


/*
validItem function checks if an item name is valid
@param      name    text to be checked for validity 
@return             boolean if input is valid
*/
function validItem(name) {
    if(name != "") { //not empty
        return true;
    }
    else {
        return false;
    }
}


/*
checked function toggles item's checked state via a class
@param      item    item whose checked state is to be altered
*/
function checked(item) {
    item.classList.toggle("checked");
}


/*
clearItems function clears all checked items from the list
*/
function clearItems() {
    //get all checked items
    var checkedItems = document.getElementsByClassName("checked");
    
    //remove every item that has been checked
    while(checkedItems[0]) {
        checkedItems[0].parentNode.removeChild(checkedItems[0]);
    }
}

/*
function sortItems sorts list contents based on arguments
@param      type        type of sort to be conducted. 
                        0: alphanumericly
                        1: by duration
                        2: by colour
            direction   direction of sort
                        0: ascending
                        1: descending
*/
function sortItems(type, directon) {
    var swaping, items, swap, a, b;
    var list = document.getElementById("listItems"); //list element
    
    //simple bubble sort 
    do {
        swaping = false;
        items = list.getElementsByTagName("li"); //get new list of items (ordering will change)
        
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
            //if second type (duration)
            else if(type == 1) {
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
            //third type (colour)
            else {
                a = items[i].getAttribute("colour");
                    b = items[i+1].getAttribute("colour");
            }
            
            if(a > b) {
                items[i].parentNode.insertBefore(items[i+1], items[i]); //swap items
                swaping = true; //continue to sort
                break;
            }
        }
    } while(swaping);
}


/*
colourChange function changes the colour of the colour pick icon based on used entry
This is to overwride the styling of the innate colour input element
*/
function colourChange() {
    var colourPicker = document.getElementById("colourPicker");
    colourPicker.parentElement.style.color = colourPicker.value; //set colour of icon to value of colour picker
}
