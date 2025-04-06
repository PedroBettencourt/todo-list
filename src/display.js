import {Project, projectList} from "./project.js";
import Task from "./task.js";
import deleteImg from "./images/delete.svg";

export default (() => {

    // Button to add a project
    const btnProject = document.querySelector("button.project");
    btnProject.addEventListener("click", (e) => {
        e.stopPropagation();
        const form = addProjectForm();
        window.addEventListener("click", (e) => closeWindow(e, form));
    });

    // Button to add a task
    const btnTask = document.querySelectorAll("button.task");
    btnTask.forEach(btn => btn.addEventListener("click", (e) => {
        e.stopImmediatePropagation();
        const scope = btn.id;
        const form = addTaskForm(scope);
        window.addEventListener("click", (e) => closeWindow(e, form));
    }));

    // Close form if clicked outside
    const closeWindow = ((e, element) => {
        if (!element.contains(e.target)) {
            element.remove();
        }
    })

    // Show project and then its tasks
    const displayProject = ((project) => {
        const taskList = document.querySelector("div.list");
        taskList.innerHTML = "";
        taskList.id = project.name;
        project.getTasks().forEach(task => {
            const taskDisplay = displayTask(task);
            taskList.appendChild(taskDisplay);
        });
    })

    const displayTask = ((task) => {
        const taskDisplay = document.createElement("div");
        taskDisplay.classList = "task";

        const taskCheckbox = document.createElement("button");
        taskCheckbox.textContent = task._checkbox; //IMPROVE THIS!!!!!!!!!!!!!!!!!!!!!!!!!
        // Event listener to change the checkbox
        taskCheckbox.addEventListener("click", () => {
            task.toggleCheckbox();
            console.log(task)
            taskCheckbox.textContent = task._checkbox; // THIS TOOOOOOOOOOOOOOOOOO
        })

        const taskText = document.createElement("div");
        taskText.textContent = task.title;

        // Button to delete task
        const taskDelete = document.createElement("img");
        taskDelete.classList = "delete";
        taskDelete.src = deleteImg;
        taskDelete.addEventListener("click", () => {
            taskDisplay.remove();
            removeTask(task);
        })

        // Click task to show more information
        taskText.addEventListener("click", (e) => {
            e.stopPropagation();
            showTask(task);
        });

        taskDisplay.appendChild(taskCheckbox);
        taskDisplay.appendChild(taskText);
        taskDisplay.appendChild(taskDelete);

        return taskDisplay;
    })

    // Projects
    const addProjectForm = (() => {
        let newForm = document.createElement("form");
        newForm = addFormElement(newForm, "input", "name", "text");

        // Submit form button
        const formSubmit = document.createElement("button");
        formSubmit.textContent = "Create Project";
        formSubmit.addEventListener("click", (e) => {
            e.preventDefault();
            const value = document.querySelector("input").value;
            // Check if the form isn't empty
            if (value) {         
                const project = new Project(value);
                addProjectNav(project);
            }
            newForm.remove();
        });
        newForm.appendChild(formSubmit);

        // Close form button
        const formCloseBtn = document.createElement("button");
        formCloseBtn.classList = "close";
        formCloseBtn.textContent = "Close";
        formCloseBtn.addEventListener("click", () => {
            newForm.remove();
        })
        newForm.appendChild(formCloseBtn)

        document.body.appendChild(newForm);

        return newForm
    })

    const addProjectNav = ((project) => {
        projectList.addProject(project);

        const projects = document.querySelector("div.projects");
        const newProject = document.createElement("div");
        newProject.classList = "project";
        const projectName = document.createElement("span");
        projectName.textContent = project.name;
        
        // Show project
        projectName.addEventListener("click", () => displayProject(project));

        newProject.appendChild(projectName);

        // Button to remove project
        if (project.name !== "Inbox" && project.name !== "Today" && project.name !== "Week") {
            const deleteBtn = document.createElement("img");
            deleteBtn.classList = "delete";
            deleteBtn.src=deleteImg;
            deleteBtn.addEventListener("click", () => {
                deleteProject(project);
                newProject.remove();
                deleteBtn.remove();
            });
            newProject.appendChild(deleteBtn);
        };

        projects.appendChild(newProject);
    })

    const deleteProject = ((project) => {
        projectList.removeProject(project);
        displayProject(projectList.getList()[0]);
    })

    const getCurrentProject = (() => {
        const list = document.querySelector("div.list");
        const name = list.id;
        const project = projectList.getProject(name);
        return project;
    })

    // Tasks
    const addTaskForm = ((scope) => {               
        let newForm = document.createElement("form");
        newForm = addFormElement(newForm, "input", "title", "text");
        newForm = addFormElement(newForm, "input", "description", "text");
        newForm = addFormElement(newForm, "input", "date", "date");
        newForm = addFormElement(newForm, "select", "priority");

        // Submit form button
        const formSubmit = document.createElement("button");
        formSubmit.textContent = "Create Task";
        formSubmit.addEventListener("click", (e) => {
            e.preventDefault();
            const values = document.querySelectorAll("input");
            const title = values[0].value;
            const description = values[1].value;
            const date = values[2].value;
            const priority = document.querySelector("select").value;
            const checkbox = false;
            if(title) {
                const task = new Task(title, description, date, priority, checkbox);
                addTaskProject(task, scope);
            }
            newForm.remove();
        });
        newForm.appendChild(formSubmit);

        // Close form button
        const formCloseBtn = document.createElement("button");
        formCloseBtn.classList = "close";
        formCloseBtn.textContent = "Close";
        formCloseBtn.addEventListener("click", () => {
            newForm.remove();
        })
        newForm.appendChild(formCloseBtn)

        document.body.appendChild(newForm);

        return newForm;
    })

    const addTaskProject = ((task, scope) => {
        const inbox = projectList.getList()[0];
        inbox.addTask(task);

        if (scope === "global") return;

        const currentProject = getCurrentProject();
        if (currentProject !== inbox) currentProject.addTask(task);
        displayProject(currentProject);    
    })

    const removeTask = ((task) => {
        const inbox = projectList.getList()[0];
        const projectCurrent = getCurrentProject();

        if (inbox !== projectCurrent) {
            inbox.removeTask(task);
            projectCurrent.removeTask(task);
            return
        }

        for (const project of projectList.getList()) {
            //console.log(project.getTasks());
            if (project.getTasks().find(item => item === task)) {
                project.removeTask(task);
            }
        }
    })

    const showTask = ((task) => {
        const card = document.createElement("div");
        card.classList = "card";
        window.addEventListener("click", (e) => closeWindow(e, card));

        const title = document.createElement("div");
        title.textContent = task.title;
        const description = document.createElement("div");
        description.textContent = task.description;
        const dueDate = document.createElement("div");
        dueDate.textContent = task.dueDate;
        const priority = document.createElement("div");
        priority.textContent = task.priority;

        const closeBtn = document.createElement("button");
        closeBtn.classList = "close";
        closeBtn.textContent = "X";
        closeBtn.addEventListener("click", () => {
            card.remove();
        })
        
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(dueDate);
        card.appendChild(priority);
        card.appendChild(closeBtn);
        document.body.appendChild(card);
    })

    const addFormElement = ((newForm, format, property, type) => {
        const formElementLabel = document.createElement("label");
        formElementLabel.setAttribute("for", property);
        formElementLabel.textContent = property;

        const formElement = document.createElement(format);
        formElement.setAttribute("id", property);
        formElement.setAttribute("name", property);

        if (format === "input") {
            formElement.setAttribute("type", type);
            
        } else if (format === "select") {
            const options = ["low", "medium", "high"];
            for (let i=0; i<3; i++) {
                const option = document.createElement("option");
                option.value = options[i];
                option.textContent = options[i];
                formElement.appendChild(option);
            }
        }

        newForm.appendChild(formElementLabel);
        newForm.appendChild(formElement);
        return newForm;
    })

    return {addProjectNav, displayProject};
})();