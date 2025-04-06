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

// New random tasks
const taskOne = new Task("Do something", "Something and another thing", "06-05-2025", "medium", false);
taskOne.title = "Do this task";
taskOne.toggleCheckbox();

const taskTwo = new Task("Do another thing", "Something important probably", "07-04-2025", "high", false);

projInbox.addTask(taskOne);
projToday.addTask(taskOne);

projInbox.addTask(taskTwo);
projWeek.addTask(taskTwo);

display.addProjectTaskNumber(projInbox);
display.addProjectTaskNumber(projToday);
display.addProjectTaskNumber(projWeek);

display.displayProject(projInbox);
const inbox = document.querySelector("span");
inbox.classList.toggle("selected");