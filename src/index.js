import "./style.css"
import {Project, projectList} from "./project.js";
import Task from "./task.js";
import display from "./display.js";
import storage from "./storage.js";


// Add all the default projects and tasks if local storage is empty
if (localStorage.length === 0) {
    // Create an inbox that stores all todos
    const projInbox = new Project("Inbox", "f75cf5fd-1291-4d64-aff2-eef12202ce35");

    // Create a project for today todos
    const projToday = new Project("Today", "ad2b4ab8-8b91-4b2d-8d0e-8187850c9684");

    // Create a project for week todos
    const projWeek = new Project("Week", "98a30ae2-ce41-454b-83c4-49bfc805cb37");

    // Create random project
    const projRandom = new Project("Random", "a9e0fedf-be17-430e-af62-7ccc459532af");

    projectList.addProject(projInbox);
    projectList.addProject(projToday);
    projectList.addProject(projWeek);
    projectList.addProject(projRandom);

    // New random tasks
    const taskOne = new Task("Do something", "Something and another thing", "06-05-2025", "medium", false);
    const taskTwo = new Task("Do another thing", "Something important probably", "07-04-2025", "high", true);

    projInbox.addTask(taskOne);
    projToday.addTask(taskOne);
    projInbox.addTask(taskTwo);
    projWeek.addTask(taskTwo);

    storage.saveProject(projInbox);
    storage.saveProject(projToday);
    storage.saveProject(projWeek);
    storage.saveProject(projRandom);

    storage.saveTask(projInbox, taskOne);
    storage.saveTask(projToday, taskOne);
    storage.saveTask(projInbox, taskTwo);
    storage.saveTask(projWeek, taskTwo);
    
} else {
    storage.getStorage();
}

const inbox = projectList.getProject("f75cf5fd-1291-4d64-aff2-eef12202ce35");
display.showProjects();
display.displayProject(inbox);
display.selectProject(document.querySelector("span"))