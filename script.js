//event listener for add button
document.getElementById("add").addEventListener("click", addItem);

//event listener for remove button
document.getElementById("remove").addEventListener("click", clearItems);

//event listener for highlight button
document.getElementById("highlight").addEventListener("click", toggleHighlight);

//event listener for sort button
document.getElementById("sort").addEventListener("click", sortItems);


//Adds the item entered by the user to the list
function addItem() {
    //get value of item entered
    var itemName = document.forms["addItem"]["itemName"].value;
    
    if(validItem(itemName)) {
        //clear form
        document.getElementById("add-item").reset();
        
        //create new div element to hold all the new item elements
        var newItem = document.createElement("div");
        newItem.classList.add("item");
        
        //create checkbox
        var newItemCheckbox = document.createElement("input");
        newItemCheckbox.setAttribute("type", "checkbox");
        newItemCheckbox.setAttribute("name", "checkbox");
        
        //create heading for name
        var newItemName = document.createElement("h2");
       
        //add checkbox to name heading
        newItemName.appendChild(newItemCheckbox);
        
        //add item name to heading
        var newItemText = document.createTextNode(itemName);
        newItemName.appendChild(newItemText);
       
        //add heading to div
        newItem.appendChild(newItemName);
        
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

//clears all checked items from the list
function clearItems() {
    addCheckedClass();
    
    //create list of all divs with class "checked"
    var checkedItems = document.getElementsByClassName("checked");
    
    //remove every div with a checked box
    while(checkedItems[0]) {
        checkedItems[0].parentNode.removeChild(checkedItems[0]);
    }
}
    

//toggles the higlight of checked items on/off
function toggleHighlight() {
    addCheckedClass();
    
    var checkedItems = document.getElementsByClassName("checked");
    
    for(var i=0; i<checkedItems.length; i++) {
        checkedItems[i].classList.toggle("highlighted");
    }
}


/*Adds the class "checked" to every item (div) with a checked checkbox
function addCheckedClass() {
     var listItems = document.getElementsByClassName("item");
    
    
    for(var i=0; i<listItems.length; i++){
        //get checkbox
        var checkbox = listItems[i].firstChild.firstChild;
        if(checkbox.checked) {
           listItems[i].classList.add("checked");
        } 
    }
}*/

//Adds the class "checked" to every item (div) with a checked checkbox
function addCheckedClass() {
     var checkboxes = document.getElementsByName("checkbox");
    
    for(var i=0; i<checkboxes.length; i++){
        //get checkbox
        if(checkboxes[i].checked) {
           checkboxes[i].parentNode.parentNode.classList.add("checked");
        } 
    }
}


function sortItems() {
    //sort items alphanumerically
    
    //remove element and append it to the top of the list
}