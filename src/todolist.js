export default class TodoList {
    constructor(title, description, dueDate, priority, checklist) {
        this._title = title;
        this._description = description;
        this._dueDate = dueDate;
        this._priority = priority;
        this._checklist = checklist;
        //this.notes = notes;
    }

    get title() {
        return this._title;
    }

    set title(titleNew) {
        this._title = titleNew;
    }

    get description() {
        return this._description;
    }

    set description(discriptionNew) {
        this._description = discriptionNew;
    }

    get dueDate() {
        return this._dueDate;
    }

    set dueDate(dueDateNew) {
        this._dueDate = dueDateNew;
    }

    get priority() {
        return this._priority;
    }

    set priority(priorityNew) {
        this._priority = priorityNew;
    }

    toggleChecklist() {
        if(this._checklist) this._checklist = false;
        else this._checklist = true;
    }
}