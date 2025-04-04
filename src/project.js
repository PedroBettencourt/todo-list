export default class Project {
    constructor(name) {
        this._name = name;
        this.items = [];
    }

    get name() {
        return this._name;
    }

    set name(nameNew) {
        this._name = nameNew;
    }

    addTodo(todo) {
        this.items.push(todo);
    }

    removeTodo(todo) {
        const index = this.items.indexOf(todo);
        if (index > -1) this.items.splice(index, 1);
    }

    getTodos() {
        return this.items;
    }
}