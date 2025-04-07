import { Project, projectList } from "./project";
import Task from "./task";

export default (() => {

    const saveProject = ((project) => {
        const toSend = {name: project.name, tasks: {}};
        localStorage.setItem(project._id, JSON.stringify(toSend));
    })

    const saveTask = ((project, task) => {
        // GUARDAR A TASK
        const savedTask = {title: task._title, 
                           description: task._description, 
                           dueDate: task._dueDate, 
                           priority: task._priority, 
                           checkbox: task._checkbox};

        const projectSaved = JSON.parse(localStorage.getItem(project._id));
        const savedTasks = projectSaved.tasks;
        savedTasks[task._id] = savedTask;
        
        const toSend = {name: project.name, tasks: savedTasks};
        localStorage.setItem(project._id, JSON.stringify(toSend));
    })

    
    const getStorage = (() => {
        // Inbox
        const inbox = JSON.parse(localStorage.getItem("f75cf5fd-1291-4d64-aff2-eef12202ce35"));
        const projectInbox = new Project("Inbox", "f75cf5fd-1291-4d64-aff2-eef12202ce35");
        const projectTasks = inbox.tasks;

        // Create all tasks
        for (const newId of Object.keys(projectTasks)) {
            const taskNew = projectTasks[newId];
            const title = taskNew.title;
            const description = taskNew.description;
            const dueDate = taskNew.dueDate;
            const priority = taskNew.priority;
            const checkbox = taskNew.checkbox;
            const task = new Task(title, description, dueDate, priority, checkbox, newId)
            projectInbox.addTask(task);
        }

        projectList.addProject(projectInbox);
        
        // The other projects
        for (const storedId of Object.keys(localStorage)) {
            if (storedId !== "f75cf5fd-1291-4d64-aff2-eef12202ce35") {
                const stored = JSON.parse(localStorage.getItem(storedId));
                const project = new Project(stored.name, storedId);
                const tasks = stored.tasks;
                for (const storedTask of Object.keys(tasks)) {
                    const task = projectInbox.getTask(storedTask);
                    project.addTask(task);                    
                }
                projectList.addProject(project);
            }
        }     
    })

    return {saveProject, saveTask, getStorage};

})();