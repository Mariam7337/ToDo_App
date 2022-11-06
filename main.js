const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');

let tasks = [];

if(localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
}

tasks.forEach(function(task) {
    let cssClass;
    if(task.done){
        cssClass = 'task-title task-title--done'
    } else {
        cssClass = 'task-title'
    }
     
    const taskTextHTML = `
    <li id = "${task.id}" class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${task.text}</span>
        <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="cross.svg" alt="Done" width="18" height="18">
            </button>
        </div>
    </li>
    `

    tasksList.insertAdjacentHTML('beforeend', taskTextHTML);
})

checkListEmpty();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', taskDelete);
tasksList.addEventListener('click', taskDone);


function addTask(event) {
    event.preventDefault();
    const taskText = taskInput.value;

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    }

    tasks.push(newTask);
    saveToLocalStorage();

    let cssClass;
    if(newTask.done){
        cssClass = 'task-title task-title--done'
    } else {
        cssClass = 'task-title'
    }
     
    const taskTextHTML = `
    <li id = "${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${newTask.text}</span>
        <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="cross.svg" alt="Done" width="18" height="18">
            </button>
        </div>
    </li>
    `

    tasksList.insertAdjacentHTML('beforeend', taskTextHTML);
    taskInput.value = "";
    taskInput.focus();
    checkListEmpty();

}

function taskDelete(event) {
    if(event.target.dataset.action === 'delete') {
        const perentNode = event.target.closest('li');

        const id = Number(perentNode.id);

        tasks = tasks.filter(function(task) {
            if(task.id === id) {
                return false
            } else {
                return true
            }
        })

        saveToLocalStorage();
       
        perentNode.remove();
    }
    checkListEmpty();
}

function taskDone(event) {
    if(event.target.dataset.action === 'done') {
        const perentNode = event.target.closest('li');

        const id = Number(perentNode.id);
        const task =  tasks.find(function(task) {
            if(task.id === id) {
                return true
            }
        })
        task.done = !task.done;
        saveToLocalStorage()


        const taskTitle = perentNode.querySelector('.task-title');
        taskTitle.classList.toggle('task-title--done')
    }
}

function checkListEmpty() {
    if(tasks.length === 0) {
        const taskEmptyHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
    </li>`

    tasksList.innerHTML = taskEmptyHTML;
    }

    if(tasks.length > 0) {
        const taskEmptyEl = tasksList.querySelector('#emptyList');
        taskEmptyEl ? taskEmptyEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}