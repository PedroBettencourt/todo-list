class Project {
    constructor(name) {
        this._name = name;
        this._tasks = [];
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

    getTasks() {
        return this._tasks;
    }
}

const projectList = (() => {
    const list = [];

    const getList = (() => {
        return list;
    })

    const getProject = ((name) => {
        const project = list.find(projNow => projNow.name === name)
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