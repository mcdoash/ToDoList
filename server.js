const express = require("express");
let app = express();
const server = require("http").createServer(app);

//define two test lists
let lists = [
	{
		name: "Test List 1",
		id: 0,
		nextID: 4,
		items: [
			{id: 0, name: "Walk dog", hours: 1, minutes: 0, totalTime: 60, colour: "#000000", hue: -2, checked: false},
			{id: 1, name: "Start assignment", hours: 2, minutes:30, totalTime: 150, colour: "#d12642", hue: 359.9973, checked: true},
			{id: 2, name: "Bake cookies", hours: 1, minutes: 15, totalTime: 75, colour: "#2455d1", hue: 0.0619,checked: true},
			{id: 3, name: "Study for exam", hours: 3, minutes: 0, totalTime: 180, colour: "#d12642", hue: 359.9973, checked:false}
		]
	},
	{
		name: "Colour test",
		id: 1,
		nextID: 11,
		items: [
			{name: "4", hours: 0, minutes: 0, totalTime: 0, colour: "#7de100", hue: 0.0241, checked: false, id:0},
			{name: "6", hours: 0 ,minutes: 0, totalTime: 0, colour: "#00e17d", hue: 0.0426, checked: false, id:1},
			{name: "3", hours: 0, minutes: 0, totalTime: 0, colour: "#e1e100", hue: 0.0167, checked: false, id: 2},
			{name: "9", hours: 0, minutes: 0, totalTime:0, colour: "#0000e1", hue: 0.0667, checked: false, id:3},
			{name: "5", hours: 0, minutes: 0, totalTime: 0, colour: "#00e100", hue: 0.0333, checked: false, "id": 4},
			{name: "11", hours: 0, minutes: 0, totalTime:0, colour: "#e100e1", hue: 359.9833, checked: false, id: 5},
			{name: "7", hours: 0, minutes: 0, totalTime: 0, colour: "#00e1e1", hue :0.0500, checked: false, id: 6},
			{name: "8", hours: 0, minutes: 0, totalTime: 0, colour: "#007de1", hue: 0.0557, checked: false, id: 7},
			{name: "1", hours: 0, minutes: 0, totalTime: 0, colour: "#e10000", hue: 0.0000, checked: false, id:8},
			{name: "10", hours: 0, minutes: 0, totalTime: 0, colour: "#7d00e1", hue: 0.0759, checked: false, id: 9},
			{name: "2", hours: 0, minutes: 0, totalTime: 0, colour: "#e17d00", hue: 0.0093, checked: false, id:10}
		]
	}
];
let nextID = 2;

app.use(express.static("public"));
app.use("*", function(req, res) {
  res.status(404).send({error: "Resource Not Found"});
});


const io = require("socket.io")(server);

io.on("connection", socket =>{
	console.log("A connection was made.");
	//display masterlist to client
	socket.emit("buildMasterlist", lists.map(list => ({id: list.id, name: list.name})));

	socket.on("disconnect", () => {console.log("Someone left.");});

	//add a new list to the list of lists
	socket.on("createList", list => {
		list.items = [];
		list.nextID = 0;
		list.id = nextID;
		nextID++;
		lists.push(list);

		//update everyone's masterlist and show new list to client
		io.emit("appendList", list); 
		changeList(list.id);
	});

	//change client's list
	socket.on("setList", id => {changeList(id);});

	//show selected list to client
	function changeList(id) {
		socket.currentList = id;
		socket.join(id);
		console.log("Someone joined list " + id + ".");

		socket.emit("setTitle", lists[id].name);
		socket.emit("renderList", lists[id].items);
	}

	//remove client from current list 
	socket.on("leaveList", () => {
		socket.leave(socket.currentList);
		console.log("Someone left list " + socket.currentList + ".");
	});

	//add an item to the client's current list
	socket.on("addItem", item => { 
		item.id = lists[socket.currentList].nextID;
		lists[socket.currentList].items.push(item);
		lists[socket.currentList].nextID++;	

		io.in(socket.currentList).emit("appendItem", item);
	});

	//change the checked status of a selected item
	socket.on("checkItem", id => { 
		let item = lists[socket.currentList].items.find(a => {return a.id == id});
		item.checked = !item.checked; 
		io.in(socket.currentList).emit("checkItem", item.id);
	});
	
	//remove all checked items from a list
	socket.on("clearChecked", () => { 
		lists[socket.currentList].items = lists[socket.currentList].items.filter(item => !item.checked);
		io.in(socket.currentList).emit("clearChecked");
	});
	
	//change the colour of an item
	socket.on("changeColour", data => { 
		let item = lists[socket.currentList].items.find(a => {return a.id == data.id});
		item.colour = data.colour;
		item.hue = data.hue;
		io.in(socket.currentList).emit("changeColour", item);
	});
});


//Server listens on port 3000
server.listen(3000);
console.log("Server running on port 3000");