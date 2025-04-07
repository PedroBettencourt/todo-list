import {v4 as uuid4} from "uuid";

class Project {
    constructor(name, id = uuid4(), tasks = []) {
        this._id = id;
        this._name = name;
        this._tasks = tasks;
    }

    get name() {
        return this._name;
    }

    set name(nameNew) {
        this._name = nameNew;
    }

    addTask(todo) {
        this._tasks.push(todo);
    }

    removeTask(todo) {
        const index = this._tasks.indexOf(todo);
        if (index > -1) this._tasks.splice(index, 1);
    }

    getTask(task) {
        for (const key of Object.keys(this._tasks)) {
            if (task === this._tasks[key]._id) {
                return this._tasks[key]
            }
        }
    }

    getTasks() {
        return this._tasks;
    }
}

const projectList = (() => {
    const list = [];

    const getList = (() => {
        return list;
    })

    const getProject = ((id) => {
        const project = list.find(projNow => projNow._id === id)
        return project;
    })

    const addProject = ((project) => {
        list.push(project);
    })

    const removeProject = ((project) => {
        const index = list.indexOf(project);
        if (index > -1) list.splice(index, 1);
    })

    return {getList, getProject, addProject, removeProject}
})()

export {Project, projectList};