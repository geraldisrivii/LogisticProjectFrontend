import ApiHelper from "./js/ApiHelper.js";


// Conteiner that holds the task
let taskBox = document.querySelector(".accept-card-task-box")

// Button that activates isEnabled Mode of mover
let statusButton = document.querySelector(".accept-card__status-button")

let helper = new ApiHelper('http://logisticproject.ua');

let ButtonActivate = document.querySelector(".settings-card__button");

// Get current task of mover
let promiseCurrentTasksOfMover = helper.getObjectFromData('currentTasks', {
    user_id: 4,
    status: 1
}, true)


let States = {
    'already have task': function () {
        statusButton.disabled = true
    },
    'complete task': function () {
        taskBox.innerHTML = 'Вы завершили задачу';
        statusButton.disabled = false
        document.querySelector(`label[for=${statusButton.id}]`).textContent = 'Встать на получение';
        statusButton.checked = false
    },
    'dont have task': function () {
        taskBox.innerHTML = 'Активных задач нет. Встаньте на получение';
    },
    'start work': function () {
        document.querySelector(`label[for=${statusButton.id}]`).textContent = 'Уйти с подачи';
    }
}

// Get data about mover
let promiseDataAboutMover = helper.getObject('movers', localStorage.getItem('id'))

// Compose promise to gradual implementation
Promise.all([promiseCurrentTasksOfMover, promiseDataAboutMover]).then(async ([response, response2]) => {

    // Declare isEnabled, so it must be allowed global
    let isEnabled = null;

    // If user data with id is not found, return
    if (response2.status !== 200) {
        return;
    }
    // Get isEnabled
    isEnabled = response2.data.isEnabled
    console.log(isEnabled)

    // If task already been taken
    if (response.status === 200) {
        // GET TASK ID and LINK ID
        let taskId = response.data[0].task_id
        let linkId = response.data[0].id

        // GET CURRENT TASK - with body of task
        let task = await helper.getObject('tasks', taskId)
        // Render task
        let html = ` <h3 class="accept-card__current-task">${task.data.title}</h3>
        <p class="accept-card__current-task-price">${task.data.price} руб</p>
        <button id="complete-button" class="button">Завершить</button>`
        taskBox.innerHTML = html

        // Change state of main elements:
        States["already have task"]()

        // If user take task and start it we must change IsEnabled to 0, because now mover is busy
        let responseUpdateMover = await helper.pathObject('movers', localStorage.getItem('id'), {
            isEnabled: 0
        })

        // Add event listener to complete button
        let completeButton = document.querySelector("#complete-button")
        completeButton.addEventListener("click", async function () {

            let AllLinks = await helper.getObjectFromData('currentTasks', {
                task_id: taskId
            })
            console.log(AllLinks)
            // If we wan't tp complete function we must delete link from currentTasks
            for (const element of AllLinks.data) {
                let response = await helper.deleteElement('currentTasks', element.id);
                console.log(response)
            }

            // Next, if deleting link was successfull
            if (AllLinks.status == 200) {
                // We must create link in completedTasks
                for (const element of AllLinks.data) {
                    let response = await helper.linkObject('tasks', {
                        task_id: taskId,
                        user_id: element.user_id,
                        filter: 'completed'
                    })
                    console.log(response)
                }
                // Change state of main elements:
                States["complete task"]()

            }
        })

    }
    //  If task is not taken, but before exit of site or reload it, have been enabled search. 
    else if (isEnabled == 1) {
        debugger;
        console.log(isEnabled)
        // This change is necessary because function does not work without this
        statusButton.checked = true
        // pass to function object of context
        createWaitingOfTask.call(statusButton)
    }
    //  This way is possible if dosn't have task already and search have been disabled (IsEnabled = 0)
    else {
        States['dont have task']();
    }
})


// Global variable for id of timer that is used to stop timer
let idInterval = null;
// This function use context of statusButton 
async function createWaitingOfTask() {
    // Status button have been pressed => mover is free
    if (this.checked == true) {
        // Change isEnabled of mover to 1 (because this will allow manager to give task of this mover)
        let responseUpdateMover = helper.pathObject('movers', localStorage.getItem('id'), {
            isEnabled: 1
        })
        responseUpdateMover.then(async function (response) {
            console.log(response)
        })
        // Change state of main elements:
        States['start work']()

        // Cnage idInterval that will be used to stop timer
        idInterval = setInterval(async () => {
            let responseTask = await helper.getObjectFromData('currentTasks', {
                user_id: localStorage.getItem('id')
            }, true)
            if (responseTask.status == 200) {
                let taskId = responseTask.data[0].task_id
                let linkId = responseTask.data[0].id

                let task = await helper.getObject('tasks', taskId)
                // Render task
                let html = ` <h3 class="accept-card__current-task">${task.data.title}</h3>
                            <p class="accept-card__current-task-price">${task.data.price} руб</p>
                            <button id="complete-button" class="button">Завершить</button>`
                taskBox.innerHTML = html
                this.disabled = true

                // If user take task and start it we must change IsEnabled to 0, because now mover is busy
                let responseUpdateMover = await helper.pathObject('movers', localStorage.getItem('id'), {
                    isEnabled: 0
                })

                let response = await helper.pathObject('currentTasks', linkId, {
                    status: 1
                })
                let completeButton = document.querySelector("#complete-button")
                completeButton.addEventListener("click", async function () {

                    // If we wan't tp complete function we must delete link from currentTasks
                    let AllLinks = await helper.getObjectFromData('currentTasks', {
                        task_id: taskId
                    })
                    console.log(AllLinks)
                    // If we wan't tp complete function we must delete link from currentTasks
                    for (const element of AllLinks.data) {
                        let response = await helper.deleteElement('currentTasks', element.id);
                        console.log(response)
                    }
                    // Next, if deleting link was successfull
                    if (AllLinks.status == 200) {
                        // We must create link in completedTasks
                        for (const element of AllLinks.data) {
                            let response = await helper.linkObject('tasks', {
                                task_id: taskId,
                                user_id: element.user_id,
                                filter: 'completed'
                            })
                            console.log(response)
                        }
                        // Change state of main elements:
                        States["complete task"]()
        
                    }
                })
                console.log(response)
                clearInterval(idInterval);
                // return
            } else {
                taskBox.innerHTML = 'Выполняется поиск.'
            }
        }, 1000)
    } else {
        clearInterval(idInterval);
        taskBox.innerHTML = 'Активных задач нет. Встаньте на получение';
        document.querySelector(`label[for=${this.id}]`).textContent = 'Встать на получение';
        let responseUpdateMover = helper.pathObject('movers', localStorage.getItem('id'), {
            isEnabled: 0
        })
    }
}
statusButton.addEventListener("click", createWaitingOfTask)



// Button that activates account of mover with token

let input = document.querySelector("input[name=token]");

ButtonActivate.addEventListener("click", async function () {
    let token = null;
    let responseID = null;
    let response = await helper.getObjectFromData('tokensMovers', {
        user_id: localStorage.getItem('id')
    })
    console.log(response)
    if (response.status != 200) {
        console.log(response)
        ButtonActivate.innerHTML = 'Ошибка получения данных.'
        return;
    }
    token = response.data[0].token
    responseID = response.data[0].id
    console.log(responseID)
    console.log(token)
    console.log(input.value)
    input.value = input.value.trim()
    if (token == input.value) {
        let response = await helper.pathObject('tokensMovers', responseID, {
            IsVerified: 1
        })
        console.log(response)
        input.value = 'Аккаунт активирован'
        ButtonActivate.disabled = true
    } else {
        ButtonActivate.innerHTML = 'Неверный токен.'
        setTimeout(() => {
            ButtonActivate.innerHTML = 'Активировать аккаунт'
        }, 2000)
    }
})