import {Project, projectList} from "./project.js";
import Task from "./task.js";
import deleteImg from "./images/delete.svg";
import closeImg from "./images/close.svg";
import { differenceInDays, startOfToday, parse} from "date-fns";
import storage from "./storage.js";

export default (() => {

    // Button to add a project
    const btnProject = document.querySelector("button.project");
    btnProject.addEventListener("click", (e) => {
        e.stopPropagation();

        // Close an already open form
        const oldCard = document.querySelector(".card")
        if (oldCard) oldCard.remove();

        const card = addProjectForm();
        window.addEventListener("click", (e) => closeWindow(e, card));
    });

    // Button to add a task
    const btnTask = document.querySelectorAll("button.task");
    btnTask.forEach(btn => btn.addEventListener("click", (e) => {
        e.stopPropagation();
        
        // Close an already open form
        const oldCard = document.querySelector(".card")
        if (oldCard) oldCard.remove();

        const scope = btn.id;
        const card = addTaskForm(scope);
        window.addEventListener("click", (e) => closeWindow(e, card));
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
        taskList.dataset.id = project._id;
        project.getTasks().forEach(task => {
            const taskDisplay = displayTask(task);
            taskList.appendChild(taskDisplay);
        });
    })

    const displayTask = ((task) => {
        const taskDisplay = document.createElement("div");
        taskDisplay.classList = "task";
        if (task._checkbox) taskDisplay.classList.toggle("checked");

        const taskCheckbox = document.createElement("div");
        taskCheckbox.classList.add("checkbox");

        // Event listener to change the checkbox
        taskCheckbox.addEventListener("click", () => {
            task.toggleCheckbox();
            taskDisplay.classList.toggle("checked")
        })

        const taskText = document.createElement("div");
        taskText.classList = "task-content"
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
        const card = document.createElement("div");
        card.classList = "card";

        let newForm = document.createElement("form");
        newForm.classList = "project-form";
        newForm = addFormElement(newForm, "input", "name", "text", "Project Name:");

        // Submit form button
        const formSubmit = document.createElement("button");
        formSubmit.textContent = "Create Project";
        formSubmit.addEventListener("click", (e) => {
            e.preventDefault();
            const value = document.querySelector("input").value;
            // Check if the form isn't empty
            if (value) {         
                const project = new Project(value);
                projectList.addProject(project);
                // Local Storage
                storage.saveProject(project);
                addProjectNav(project);
            }
            newForm.remove();
        });
        newForm.appendChild(formSubmit);

        // Close form button
        const formCloseBtn = document.createElement("img");
        formCloseBtn.classList = "close";
        formCloseBtn.src = closeImg;
        formCloseBtn.addEventListener("click", () => {
            newForm.remove();
        })
        newForm.appendChild(formCloseBtn)

        card.appendChild(newForm);
        document.body.appendChild(card);

        return card;
    })

    const addProjectNav = ((project) => {
        const projects = document.querySelector("div.projects");
        const newProject = document.createElement("div");
        newProject.classList = "project";
        newProject.dataset.id = project._id;
        const projectName = document.createElement("span");
        projectName.textContent = project.name;
        
        // Show project
        projectName.addEventListener("click", () => {
            // Make project in sidebar be selected
            selectProject(projectName);
            displayProject(project);
        });
        
        newProject.appendChild(projectName);

        // Add display of number of tasks in the project
        const number = document.createElement("div");
        number.classList = "number";
        newProject.appendChild(number);

        // Button to remove project
        if (project.name !== "Inbox" && project.name !== "Today" && project.name !== "Week") {
            const deleteBtn = document.createElement("img");
            deleteBtn.classList = "delete";
            deleteBtn.src=deleteImg;
            deleteBtn.addEventListener("click", () => {
                deleteProject(project, getCurrentProject());
                newProject.remove();
                deleteBtn.remove();
            });
            newProject.appendChild(deleteBtn);
        };

        projects.appendChild(newProject);
        addProjectTaskNumber(project);
    })

    const showProjects = (() => {
        for (const project of projectList.getList()) {
            addProjectNav(project);
            addProjectTaskNumber(project);
        }
    })

    const selectProject = ((project) => {
        const projectSelected = document.querySelector(".selected");
        if (projectSelected) {
            projectSelected.classList.toggle("selected");
        }
        project.classList.toggle("selected");
    })

    const deleteProject = ((project, currentProject) => {
        projectList.removeProject(project);
        storage.deleteProject(project);
        if (project === currentProject) {
            displayProject(projectList.getList()[0]);
            selectProject(document.querySelector("span"));
        }
    })

    const getCurrentProject = (() => {
        const list = document.querySelector("div.list");
        const id = list.dataset.id;
        const project = projectList.getProject(id);
        return project;
    })

    // Add a number of tasks to each project in the sidebar
    const addProjectTaskNumber = ((project) => {
        const number = document.querySelector(`.projects [data-id="${project._id}"] .number`);
        number.textContent = project.getTasks().length;
    })

    // Tasks
    const addTaskForm = ((scope) => {       
        const card = document.createElement("div");
        card.classList = "card";

        let newForm = document.createElement("form");
        newForm.classList = "task-form";
        newForm = addFormElement(newForm, "input", "title", "text", "Task:");
        newForm = addFormElement(newForm, "input", "date", "date", "Due date:");
        newForm = addFormElement(newForm, "select", "priority", "", "Priority:");
        newForm = addFormElement(newForm, "textarea", "description", "", "Description:");

        // Submit form button
        const formSubmit = document.createElement("button");
        formSubmit.textContent = "Create Task";
        formSubmit.addEventListener("click", (e) => {
            e.preventDefault();
            const values = document.querySelectorAll("input");
            const title = values[0].value;
            const date = values[1].value;
            const priority = document.querySelector("select").value;
            const description = document.querySelector("textarea").value;
            const checkbox = false;
            if(title) {
                const task = new Task(title, description, date, priority, checkbox);
                addTaskProject(task, scope);
            }
            newForm.remove();
        });
        newForm.appendChild(formSubmit);

        // Close form button
        const formCloseBtn = document.createElement("img");
        formCloseBtn.classList = "close";
        formCloseBtn.src = closeImg
        formCloseBtn.addEventListener("click", () => {
            newForm.remove();
        })
        newForm.appendChild(formCloseBtn)

        card.appendChild(newForm);
        document.body.appendChild(card);

        return card;
    })

    const addTaskProject = ((task, scope) => {
        const inbox = projectList.getList()[0];
        inbox.addTask(task);
        addProjectTaskNumber(inbox);

        // Local Storage
        storage.saveTask(inbox, task);
        
        if (scope === "global") {
            const displayedProject = document.querySelector(`[data-id="${inbox._id}"]`);
            selectProject(displayedProject.firstChild);
            displayProject(inbox);
            return;
        }

        const projectCurrent = getCurrentProject();
        if (projectCurrent !== inbox) {
            projectCurrent.addTask(task);
            addProjectTaskNumber(projectCurrent);
            
            // Local Storage
            storage.saveTask(projectCurrent, task);
            
            displayProject(projectCurrent);
        } else {
            displayProject(inbox);
        }
    })

    const removeTask = ((task) => {
        const inbox = projectList.getList()[0];
        const projectCurrent = getCurrentProject();

        if (inbox !== projectCurrent) {
            inbox.removeTask(task);
            projectCurrent.removeTask(task);
            addProjectTaskNumber(inbox);
            addProjectTaskNumber(projectCurrent);
            
            // Update Storage
            storage.deleteTask(task, inbox);
            storage.deleteTask(task, projectCurrent);
            return
        }

        for (const project of projectList.getList()) {
            if (project.getTasks().find(item => item === task)) {
                project.removeTask(task);
                addProjectTaskNumber(project);

                // Update storage
                storage.deleteTask(task, project);
            }
        }
    })

    const addPropertyShowTask = ((taskPropertyTitle, taskProperty) => {
        const propertyContainer = document.createElement("div");
        propertyContainer.classList = "task-property";
        
        const propertyTitle = document.createElement("div");
        propertyTitle.textContent = taskPropertyTitle;

        const property = document.createElement("div");
        property.textContent = taskProperty;

        propertyContainer.appendChild(propertyTitle);
        propertyContainer.appendChild(property);

        return propertyContainer;
    })

    const showTask = ((task) => {
        // Remove old card with task details
        const cardOld = document.querySelector(".card");
        if (cardOld) cardOld.remove();

        const card = document.createElement("div");
        card.classList = "card";
        window.addEventListener("click", (e) => closeWindow(e, card));

        const details = document.createElement("div");
        details.classList = "details";

        const title = document.createElement("div");
        title.textContent = task.title;
        details.appendChild(title)

        const today = startOfToday();
        const date = differenceInDays(new Date(task.dueDate), today);
        const dueDate = addPropertyShowTask("Due Date:", date + " days");
        details.appendChild(dueDate);

        const priority = addPropertyShowTask("Priority:", task.priority);
        details.appendChild(priority);

        const description = addPropertyShowTask("Description:", task.description);
        details.appendChild(description);

        const closeBtn = document.createElement("img");
        closeBtn.classList = "close";
        closeBtn.src = closeImg;
        closeBtn.addEventListener("click", () => {
            card.remove();
        })
        details.appendChild(closeBtn);

        card.appendChild(details)
        document.body.appendChild(card);
    })

    const addFormElement = ((newForm, format, property, type, title) => {
        const formContainer = document.createElement("div");

        const formElementLabel = document.createElement("label");
        formElementLabel.setAttribute("for", property);
        formElementLabel.textContent = title;

        const formElement = document.createElement(format);
        formElement.setAttribute("id", property);
        formElement.setAttribute("name", property);

        if (format === "input") {
            formElement.setAttribute("type", type);
            if (property === "title") formElement.setAttribute("maxlength", "40");
            if (property === "name") formElement.setAttribute("maxlength", "15");

        } else if (format === "select") {
            const options = ["low", "medium", "high"];
            for (let i=0; i<3; i++) {
                const option = document.createElement("option");
                option.value = options[i];
                option.textContent = options[i];
                formElement.appendChild(option);
            }
        }

        formContainer.appendChild(formElementLabel);
        formContainer.appendChild(formElement);
        newForm.appendChild(formContainer);
        return newForm;
    })

    return {displayProject, addProjectTaskNumber, showProjects, selectProject};
})();