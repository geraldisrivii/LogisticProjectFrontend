
import AccountManager from "./js/AccountManager.js";
let accountManager = new AccountManager();
accountManager.verify().then((data) => {
    if(data.status == false || data.type != 'manager') {
        window.location.href = 'user.html';
    }
})



import ApiHelper from "./js/ApiHelper.js";
let currentTasks = document.querySelector('.current-tasks');
let completedTasks = document.querySelector('.completed-tasks');



let helper = new ApiHelper('http://logisticproject.ua/');

let promiseCurrentTasks = helper.getArray('converted_CurrentTasks');
let promiseCompletedTasks = helper.getArray('converted_CompletedTasks');

async function loadTasks(data, html, container) {
    if (data.status !== 200) {
        return;
    }
    for (const task of data.data) {
        let peoplesString = '';
        for (const element of task.peoples) {
            peoplesString += element.name + ' ' + element.lastName + ', ';
        }
        peoplesString = peoplesString.slice(0, -2);

        let element = document.createElement('div');
        element.id = task.id;
        element.classList.add('current-task');
        element.classList.add('task');
        element.innerHTML = html;
        element.querySelector('.current-task-description__header').innerHTML = task.title;
        element.querySelector('.current-task-description__price').innerHTML = task.price;
        element.querySelector('.task-main-box__movers').innerHTML += peoplesString;

        // Add finaly converted task
        container.append(element);
    }
}
let html = `
<div class="task-main-box">
    <div class="task-description">
        <h3 class="current-task-description__header"></h3>
        <p class="current-task-description__price"></p>
    </div>
    <p class="task-main-box__movers">peoples: </p>
</div>
<button class="task__button button">Отменить</button>`;

promiseCurrentTasks.then((data) => loadTasks(data, html, currentTasks))

promiseCompletedTasks.then((data) => {
    let array = html.split('\n');
    array.pop()
    html = array.join('\n')
    loadTasks(data, html, completedTasks)
})