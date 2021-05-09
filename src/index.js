import 'core-js/stable';
import 'regenerator-runtime/runtime';

import './css/styles.css';
import TodoView from './hbs/TodoItemsTemplate.hbs';
import TodoItems from './hbs/todoItems.hbs';

import Todos from './js/todoApi';

let app = document.getElementById('app');
app.innerHTML = TodoView({
	now: new Date().toISOString()
	});

let todos = new Todos('https://localhost:5001/api/');

let init = function() {
	todos.getTodos().then((list) => {
		let itemsList = document.getElementById('items');
		itemsList.innerHTML = "";
		console.log(list);
		itemsList.innerHTML = TodoItems(list);
		addHandlers();
	});
};


let addHandlers = function() {
	let completeBtns = document.querySelectorAll("div.task-complete > button");
	completeBtns.forEach((btn) => {
		btn.addEventListener("click", async (e) => {
			let id = e.target.dataset.id;
	
			await todos.setComplete(id);
			init();
		})
	});

	let deleteBtns = document.querySelectorAll("div.task-delete > button");
	deleteBtns.forEach((btn) => {
		btn.addEventListener("click", async (e) => {
			let id = e.target.dataset.id;

			await todos.remove(id);
			init();
		})
	});

}


document.getElementById("add").addEventListener("click", async () => {
	let elName = document.getElementById("name");
	let elDeadline = document.getElementById("deadline");

	let data = {
		"name": elName.value,
		"deadline": elDeadline.value
	}
	await todos.addTodo(data);

	elName.value = "";
	elDeadline.value = new Date().toISOString();

	init();
	/*
	{
    "name": "Wash the car",
    "isComplete": false,
    "deadline": "2021-04-30",
    "responsible": {
        "PersonId": 4,
        "name": "Leonard"
    },
    "Category": "Transportation"
}
	*/
});

init();