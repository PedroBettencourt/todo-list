import "./style.css"
import {Project} from "./project.js";
import Task from "./task.js";
import display from "./display.js";

// Create an inbox that stores all todos
const projInbox = new Project("Inbox");
display.addProjectNav(projInbox);

// Create a project for today todos
const projToday = new Project("Today");
display.addProjectNav(projToday);

// Create a project for week todos
const projWeek = new Project("Week");
display.addProjectNav(projWeek);

// Create random project
const projRandom = new Project("Random");
display.addProjectNav(projRandom);

// New todo
const taskOne = new Task("fazer x", "x e y", "05 de abril", "low", false);
taskOne.title = "Do this task";
taskOne.toggleCheckbox();

const taskTwo = new Task("Do y", "somethingsoemthing", "June 2nd", "high", false);

projInbox.addTask(taskOne);
projToday.addTask(taskOne);

projInbox.addTask(taskTwo);
projWeek.addTask(taskTwo);

display.addProjectTaskNumber(projInbox);
display.addProjectTaskNumber(projToday);
display.addProjectTaskNumber(projWeek);

display.displayProject(projInbox);