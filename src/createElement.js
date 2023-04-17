import ApiHelper from './js/ApiHelper.js';

let userType = localStorage.getItem('type');

if(userType == null || userType == 'mover'){
    window.location.href = 'user.html';
}

let helper = new ApiHelper('http://logisticproject.ua');

let moverFormBox = document.querySelector('.mover-form-box');

let CreateTasksForm = document.getElementById('CreateTasksForm');

let createTaskButton = document.getElementById('createTaskButton');

let promiseMovers = helper.getObjectFromData('movers', {
    isEnabled: 1
})

promiseMovers.then(data => {
    if (data.status !== 200) {
        console.log(data.data);
        moverFormBox.innerHTML = "Еще ни один работник не вышел на смену. ";
        createTaskButton.disabled = true
        return;
    }
    for (const mover of data.data) {
        moverFormBox.innerHTML += `<div class="peopleBox">
        <input class="peopleBox__checkbox" type="checkbox" id="${mover.id}">
        <label class="peopleBox__label" for="${mover.id}">
            <div class="id-card">
                <h3 class="id-card__header">${mover.name}</h3>
                <p class="id-card__text">${mover.lastName}</p>
            </div>
        </label>
    </div>`
    }
})
console.log(CreateTasksForm)
CreateTasksForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (moverFormBox.querySelector('.peopleBox__checkbox').checked == false) {
        CreateTasksForm.querySelector('.main-form-box-paragraph').textContent = 'Не выбран ни один работник';
        return;
    }
    let count = moverFormBox.children.length;
    let ChoosenMovers = [];
    for (const checkbox of moverFormBox.querySelectorAll('.peopleBox__checkbox')) {
        if(checkbox.checked){
            ChoosenMovers.push(checkbox.id);
        }
    }
    helper.postObjectFormData('tasks', CreateTasksForm).then(data => {
        console.log(data);
        for (const id of ChoosenMovers) {
            helper.linkObject('tasks', {
                user_id: id,
                task_id: data.data.id,
                filter: 'current',
                status: 0
            }).then(data => {
                console.log(data);
            })
        }
        /* window.location.href = 'main.html'; */
    })
})