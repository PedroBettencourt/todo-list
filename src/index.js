import Project from "./project.js";
import TodoList from "./todolist.js";

// Create an inbox that stores all todos
const projInbox = new Project("Inbox");

// Create a project for today todos
const projToday = new Project("Today");

// Create a project for week todos
const projWeek = new Project("Week");

// New todo
const todoOne = new TodoList("fazer x", "x e y", "05 de abril", "low", false);
todoOne.title = "Do this task";
todoOne.toggleChecklist();


projInbox.addTodo(todoOne);
projToday.addTodo(todoOne)

console.log(projInbox);
console.log(projToday);