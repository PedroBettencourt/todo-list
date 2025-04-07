import { Project, projectList } from "./project";
import Task from "./task";

export default (() => {

    const getOrder = (() => {
        if (localStorage.length === 0) return 0;
        let order = 0;
        for (const id of Object.keys(localStorage)) {
            const orderCurrent = JSON.parse(localStorage.getItem(id)).order;
            if (order < orderCurrent) order = orderCurrent;
        }
        return ++order;
    })

    let order = getOrder();

    const saveProject = ((project) => {
        const toSend = {name: project.name, tasks: {}, order: order++};
        localStorage.setItem(project._id, JSON.stringify(toSend));
    })

    const saveTask = ((project, task) => {
        const savedTask = {title: task._title, 
                           description: task._description, 
                           dueDate: task._dueDate, 
                           priority: task._priority, 
                           checkbox: task._checkbox};

        const projectSaved = JSON.parse(localStorage.getItem(project._id));
        const savedTasks = projectSaved.tasks;
        savedTasks[task._id] = savedTask;
        const order = projectSaved.order;
        
        const toSend = {name: project.name, tasks: savedTasks, order: order};
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
        let projectOrder = 1;
        for (const tempId of Object.keys(localStorage)) {
            for (const orderId of Object.keys(localStorage)) {
                const temp = JSON.parse(localStorage.getItem(orderId));
                const order = temp.order;
                if (order === projectOrder) {
                    const stored = JSON.parse(localStorage.getItem(orderId));
                    const project = new Project(stored.name, orderId);
                    const tasks = stored.tasks;
                    for (const storedTask of Object.keys(tasks)) {
                        const task = projectInbox.getTask(storedTask);
                        project.addTask(task);                    
                    }
                    projectList.addProject(project);
                    projectOrder++;
                }     

            }
        }
        
    })
    
    const deleteProject = ((project) => {
        for (const tempId of Object.keys(localStorage)) {
            if (tempId === project._id) {
                const order = JSON.parse(localStorage.getItem(tempId)).order;
                localStorage.removeItem(tempId)
                // Fix order of next projects
                for (const anotherId of Object.keys(localStorage)) {
                    const currentProject = JSON.parse(localStorage.getItem(anotherId))
                    if (currentProject.order > order ) {
                        const toSend = {name: currentProject.name, tasks: currentProject.tasks, order: --currentProject.order};
                        localStorage.setItem(anotherId, JSON.stringify(toSend));
                    }
                }
            }
        }
    })

    const deleteTask = ((task, project) => {
        for (const tempId of Object.keys(localStorage)) {
            if (project._id === tempId) {
                const proj = JSON.parse(localStorage.getItem(tempId));
                const tasks = proj.tasks;
                for (const taskId of Object.keys(tasks)) {
                    if (task._id === taskId) {
                        delete tasks[task._id];
                        const toSend = {name: proj.name, tasks: tasks, order: proj.order};
                        localStorage.setItem(tempId, JSON.stringify(toSend));
                    }
                }
                
            }
        }
    })
    
    return {saveProject, saveTask, deleteProject, deleteTask, getStorage};

})();