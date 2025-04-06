import {v4 as uuid4} from "uuid";

export default class Task {
    constructor(title, description, dueDate, priority, checkbox) {
        this._id = uuid4();
        this._title = title;
        this._description = description;
        this._dueDate = new Date(dueDate);
        this._priority = priority;
        this._checkbox = checkbox;
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
        this._dueDate = new Date(dueDateNew);
    }

    get priority() {
        return this._priority;
    }

    set priority(priorityNew) {
        this._priority = priorityNew;
    }

    toggleCheckbox() {
        if(this._checkbox) this._checkbox = false;
        else this._checkbox = true;
    }
}