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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1c2VyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBcGlIZWxwZXIgZnJvbSBcIi4vanMvQXBpSGVscGVyLmpzXCI7XHJcblxyXG5cclxuLy8gQ29udGVpbmVyIHRoYXQgaG9sZHMgdGhlIHRhc2tcclxubGV0IHRhc2tCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFjY2VwdC1jYXJkLXRhc2stYm94XCIpXHJcblxyXG4vLyBCdXR0b24gdGhhdCBhY3RpdmF0ZXMgaXNFbmFibGVkIE1vZGUgb2YgbW92ZXJcclxubGV0IHN0YXR1c0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWNjZXB0LWNhcmRfX3N0YXR1cy1idXR0b25cIilcclxuXHJcbmxldCBoZWxwZXIgPSBuZXcgQXBpSGVscGVyKCdodHRwOi8vbG9naXN0aWNwcm9qZWN0LnVhJyk7XHJcblxyXG5sZXQgQnV0dG9uQWN0aXZhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNldHRpbmdzLWNhcmRfX2J1dHRvblwiKTtcclxuXHJcbi8vIEdldCBjdXJyZW50IHRhc2sgb2YgbW92ZXJcclxubGV0IHByb21pc2VDdXJyZW50VGFza3NPZk1vdmVyID0gaGVscGVyLmdldE9iamVjdEZyb21EYXRhKCdjdXJyZW50VGFza3MnLCB7XHJcbiAgICB1c2VyX2lkOiA0LFxyXG4gICAgc3RhdHVzOiAxXHJcbn0sIHRydWUpXHJcblxyXG5cclxubGV0IFN0YXRlcyA9IHtcclxuICAgICdhbHJlYWR5IGhhdmUgdGFzayc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzdGF0dXNCdXR0b24uZGlzYWJsZWQgPSB0cnVlXHJcbiAgICB9LFxyXG4gICAgJ2NvbXBsZXRlIHRhc2snOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGFza0JveC5pbm5lckhUTUwgPSAn0JLRiyDQt9Cw0LLQtdGA0YjQuNC70Lgg0LfQsNC00LDRh9GDJztcclxuICAgICAgICBzdGF0dXNCdXR0b24uZGlzYWJsZWQgPSBmYWxzZVxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGxhYmVsW2Zvcj0ke3N0YXR1c0J1dHRvbi5pZH1dYCkudGV4dENvbnRlbnQgPSAn0JLRgdGC0LDRgtGMINC90LAg0L/QvtC70YPRh9C10L3QuNC1JztcclxuICAgICAgICBzdGF0dXNCdXR0b24uY2hlY2tlZCA9IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgJ2RvbnQgaGF2ZSB0YXNrJzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRhc2tCb3guaW5uZXJIVE1MID0gJ9CQ0LrRgtC40LLQvdGL0YUg0LfQsNC00LDRhyDQvdC10YIuINCS0YHRgtCw0L3RjNGC0LUg0L3QsCDQv9C+0LvRg9GH0LXQvdC40LUnO1xyXG4gICAgfSxcclxuICAgICdzdGFydCB3b3JrJzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGxhYmVsW2Zvcj0ke3N0YXR1c0J1dHRvbi5pZH1dYCkudGV4dENvbnRlbnQgPSAn0KPQudGC0Lgg0YEg0L/QvtC00LDRh9C4JztcclxuICAgIH1cclxufVxyXG5cclxuLy8gR2V0IGRhdGEgYWJvdXQgbW92ZXJcclxubGV0IHByb21pc2VEYXRhQWJvdXRNb3ZlciA9IGhlbHBlci5nZXRPYmplY3QoJ21vdmVycycsIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdpZCcpKVxyXG5cclxuLy8gQ29tcG9zZSBwcm9taXNlIHRvIGdyYWR1YWwgaW1wbGVtZW50YXRpb25cclxuUHJvbWlzZS5hbGwoW3Byb21pc2VDdXJyZW50VGFza3NPZk1vdmVyLCBwcm9taXNlRGF0YUFib3V0TW92ZXJdKS50aGVuKGFzeW5jIChbcmVzcG9uc2UsIHJlc3BvbnNlMl0pID0+IHtcclxuXHJcbiAgICAvLyBEZWNsYXJlIGlzRW5hYmxlZCwgc28gaXQgbXVzdCBiZSBhbGxvd2VkIGdsb2JhbFxyXG4gICAgbGV0IGlzRW5hYmxlZCA9IG51bGw7XHJcblxyXG4gICAgLy8gSWYgdXNlciBkYXRhIHdpdGggaWQgaXMgbm90IGZvdW5kLCByZXR1cm5cclxuICAgIGlmIChyZXNwb25zZTIuc3RhdHVzICE9PSAyMDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyBHZXQgaXNFbmFibGVkXHJcbiAgICBpc0VuYWJsZWQgPSByZXNwb25zZTIuZGF0YS5pc0VuYWJsZWRcclxuICAgIGNvbnNvbGUubG9nKGlzRW5hYmxlZClcclxuXHJcbiAgICAvLyBJZiB0YXNrIGFscmVhZHkgYmVlbiB0YWtlblxyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgLy8gR0VUIFRBU0sgSUQgYW5kIExJTksgSURcclxuICAgICAgICBsZXQgdGFza0lkID0gcmVzcG9uc2UuZGF0YVswXS50YXNrX2lkXHJcbiAgICAgICAgbGV0IGxpbmtJZCA9IHJlc3BvbnNlLmRhdGFbMF0uaWRcclxuXHJcbiAgICAgICAgLy8gR0VUIENVUlJFTlQgVEFTSyAtIHdpdGggYm9keSBvZiB0YXNrXHJcbiAgICAgICAgbGV0IHRhc2sgPSBhd2FpdCBoZWxwZXIuZ2V0T2JqZWN0KCd0YXNrcycsIHRhc2tJZClcclxuICAgICAgICAvLyBSZW5kZXIgdGFza1xyXG4gICAgICAgIGxldCBodG1sID0gYCA8aDMgY2xhc3M9XCJhY2NlcHQtY2FyZF9fY3VycmVudC10YXNrXCI+JHt0YXNrLmRhdGEudGl0bGV9PC9oMz5cclxuICAgICAgICA8cCBjbGFzcz1cImFjY2VwdC1jYXJkX19jdXJyZW50LXRhc2stcHJpY2VcIj4ke3Rhc2suZGF0YS5wcmljZX0g0YDRg9CxPC9wPlxyXG4gICAgICAgIDxidXR0b24gaWQ9XCJjb21wbGV0ZS1idXR0b25cIiBjbGFzcz1cImJ1dHRvblwiPtCX0LDQstC10YDRiNC40YLRjDwvYnV0dG9uPmBcclxuICAgICAgICB0YXNrQm94LmlubmVySFRNTCA9IGh0bWxcclxuXHJcbiAgICAgICAgLy8gQ2hhbmdlIHN0YXRlIG9mIG1haW4gZWxlbWVudHM6XHJcbiAgICAgICAgU3RhdGVzW1wiYWxyZWFkeSBoYXZlIHRhc2tcIl0oKVxyXG5cclxuICAgICAgICAvLyBJZiB1c2VyIHRha2UgdGFzayBhbmQgc3RhcnQgaXQgd2UgbXVzdCBjaGFuZ2UgSXNFbmFibGVkIHRvIDAsIGJlY2F1c2Ugbm93IG1vdmVyIGlzIGJ1c3lcclxuICAgICAgICBsZXQgcmVzcG9uc2VVcGRhdGVNb3ZlciA9IGF3YWl0IGhlbHBlci5wYXRoT2JqZWN0KCdtb3ZlcnMnLCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaWQnKSwge1xyXG4gICAgICAgICAgICBpc0VuYWJsZWQ6IDBcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXIgdG8gY29tcGxldGUgYnV0dG9uXHJcbiAgICAgICAgbGV0IGNvbXBsZXRlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb21wbGV0ZS1idXR0b25cIilcclxuICAgICAgICBjb21wbGV0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgbGV0IEFsbExpbmtzID0gYXdhaXQgaGVscGVyLmdldE9iamVjdEZyb21EYXRhKCdjdXJyZW50VGFza3MnLCB7XHJcbiAgICAgICAgICAgICAgICB0YXNrX2lkOiB0YXNrSWRcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgY29uc29sZS5sb2coQWxsTGlua3MpXHJcbiAgICAgICAgICAgIC8vIElmIHdlIHdhbid0IHRwIGNvbXBsZXRlIGZ1bmN0aW9uIHdlIG11c3QgZGVsZXRlIGxpbmsgZnJvbSBjdXJyZW50VGFza3NcclxuICAgICAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIEFsbExpbmtzLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGhlbHBlci5kZWxldGVFbGVtZW50KCdjdXJyZW50VGFza3MnLCBlbGVtZW50LmlkKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBOZXh0LCBpZiBkZWxldGluZyBsaW5rIHdhcyBzdWNjZXNzZnVsbFxyXG4gICAgICAgICAgICBpZiAoQWxsTGlua3Muc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgLy8gV2UgbXVzdCBjcmVhdGUgbGluayBpbiBjb21wbGV0ZWRUYXNrc1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIEFsbExpbmtzLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBoZWxwZXIubGlua09iamVjdCgndGFza3MnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2tfaWQ6IHRhc2tJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcl9pZDogZWxlbWVudC51c2VyX2lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6ICdjb21wbGV0ZWQnXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIENoYW5nZSBzdGF0ZSBvZiBtYWluIGVsZW1lbnRzOlxyXG4gICAgICAgICAgICAgICAgU3RhdGVzW1wiY29tcGxldGUgdGFza1wiXSgpXHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICB9XHJcbiAgICAvLyAgSWYgdGFzayBpcyBub3QgdGFrZW4sIGJ1dCBiZWZvcmUgZXhpdCBvZiBzaXRlIG9yIHJlbG9hZCBpdCwgaGF2ZSBiZWVuIGVuYWJsZWQgc2VhcmNoLiBcclxuICAgIGVsc2UgaWYgKGlzRW5hYmxlZCA9PSAxKSB7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgY29uc29sZS5sb2coaXNFbmFibGVkKVxyXG4gICAgICAgIC8vIFRoaXMgY2hhbmdlIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGZ1bmN0aW9uIGRvZXMgbm90IHdvcmsgd2l0aG91dCB0aGlzXHJcbiAgICAgICAgc3RhdHVzQnV0dG9uLmNoZWNrZWQgPSB0cnVlXHJcbiAgICAgICAgLy8gcGFzcyB0byBmdW5jdGlvbiBvYmplY3Qgb2YgY29udGV4dFxyXG4gICAgICAgIGNyZWF0ZVdhaXRpbmdPZlRhc2suY2FsbChzdGF0dXNCdXR0b24pXHJcbiAgICB9XHJcbiAgICAvLyAgVGhpcyB3YXkgaXMgcG9zc2libGUgaWYgZG9zbid0IGhhdmUgdGFzayBhbHJlYWR5IGFuZCBzZWFyY2ggaGF2ZSBiZWVuIGRpc2FibGVkIChJc0VuYWJsZWQgPSAwKVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgU3RhdGVzWydkb250IGhhdmUgdGFzayddKCk7XHJcbiAgICB9XHJcbn0pXHJcblxyXG5cclxuLy8gR2xvYmFsIHZhcmlhYmxlIGZvciBpZCBvZiB0aW1lciB0aGF0IGlzIHVzZWQgdG8gc3RvcCB0aW1lclxyXG5sZXQgaWRJbnRlcnZhbCA9IG51bGw7XHJcbi8vIFRoaXMgZnVuY3Rpb24gdXNlIGNvbnRleHQgb2Ygc3RhdHVzQnV0dG9uIFxyXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVXYWl0aW5nT2ZUYXNrKCkge1xyXG4gICAgLy8gU3RhdHVzIGJ1dHRvbiBoYXZlIGJlZW4gcHJlc3NlZCA9PiBtb3ZlciBpcyBmcmVlXHJcbiAgICBpZiAodGhpcy5jaGVja2VkID09IHRydWUpIHtcclxuICAgICAgICAvLyBDaGFuZ2UgaXNFbmFibGVkIG9mIG1vdmVyIHRvIDEgKGJlY2F1c2UgdGhpcyB3aWxsIGFsbG93IG1hbmFnZXIgdG8gZ2l2ZSB0YXNrIG9mIHRoaXMgbW92ZXIpXHJcbiAgICAgICAgbGV0IHJlc3BvbnNlVXBkYXRlTW92ZXIgPSBoZWxwZXIucGF0aE9iamVjdCgnbW92ZXJzJywgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2lkJyksIHtcclxuICAgICAgICAgICAgaXNFbmFibGVkOiAxXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXNwb25zZVVwZGF0ZU1vdmVyLnRoZW4oYXN5bmMgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLy8gQ2hhbmdlIHN0YXRlIG9mIG1haW4gZWxlbWVudHM6XHJcbiAgICAgICAgU3RhdGVzWydzdGFydCB3b3JrJ10oKVxyXG5cclxuICAgICAgICAvLyBDbmFnZSBpZEludGVydmFsIHRoYXQgd2lsbCBiZSB1c2VkIHRvIHN0b3AgdGltZXJcclxuICAgICAgICBpZEludGVydmFsID0gc2V0SW50ZXJ2YWwoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzcG9uc2VUYXNrID0gYXdhaXQgaGVscGVyLmdldE9iamVjdEZyb21EYXRhKCdjdXJyZW50VGFza3MnLCB7XHJcbiAgICAgICAgICAgICAgICB1c2VyX2lkOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaWQnKVxyXG4gICAgICAgICAgICB9LCB0cnVlKVxyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2VUYXNrLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIGxldCB0YXNrSWQgPSByZXNwb25zZVRhc2suZGF0YVswXS50YXNrX2lkXHJcbiAgICAgICAgICAgICAgICBsZXQgbGlua0lkID0gcmVzcG9uc2VUYXNrLmRhdGFbMF0uaWRcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgdGFzayA9IGF3YWl0IGhlbHBlci5nZXRPYmplY3QoJ3Rhc2tzJywgdGFza0lkKVxyXG4gICAgICAgICAgICAgICAgLy8gUmVuZGVyIHRhc2tcclxuICAgICAgICAgICAgICAgIGxldCBodG1sID0gYCA8aDMgY2xhc3M9XCJhY2NlcHQtY2FyZF9fY3VycmVudC10YXNrXCI+JHt0YXNrLmRhdGEudGl0bGV9PC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwiYWNjZXB0LWNhcmRfX2N1cnJlbnQtdGFzay1wcmljZVwiPiR7dGFzay5kYXRhLnByaWNlfSDRgNGD0LE8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiY29tcGxldGUtYnV0dG9uXCIgY2xhc3M9XCJidXR0b25cIj7Ql9Cw0LLQtdGA0YjQuNGC0Yw8L2J1dHRvbj5gXHJcbiAgICAgICAgICAgICAgICB0YXNrQm94LmlubmVySFRNTCA9IGh0bWxcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzYWJsZWQgPSB0cnVlXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgdXNlciB0YWtlIHRhc2sgYW5kIHN0YXJ0IGl0IHdlIG11c3QgY2hhbmdlIElzRW5hYmxlZCB0byAwLCBiZWNhdXNlIG5vdyBtb3ZlciBpcyBidXN5XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2VVcGRhdGVNb3ZlciA9IGF3YWl0IGhlbHBlci5wYXRoT2JqZWN0KCdtb3ZlcnMnLCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaWQnKSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzRW5hYmxlZDogMFxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBoZWxwZXIucGF0aE9iamVjdCgnY3VycmVudFRhc2tzJywgbGlua0lkLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAxXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgbGV0IGNvbXBsZXRlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb21wbGV0ZS1idXR0b25cIilcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHdlIHdhbid0IHRwIGNvbXBsZXRlIGZ1bmN0aW9uIHdlIG11c3QgZGVsZXRlIGxpbmsgZnJvbSBjdXJyZW50VGFza3NcclxuICAgICAgICAgICAgICAgICAgICBsZXQgQWxsTGlua3MgPSBhd2FpdCBoZWxwZXIuZ2V0T2JqZWN0RnJvbURhdGEoJ2N1cnJlbnRUYXNrcycsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFza19pZDogdGFza0lkXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhBbGxMaW5rcylcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB3ZSB3YW4ndCB0cCBjb21wbGV0ZSBmdW5jdGlvbiB3ZSBtdXN0IGRlbGV0ZSBsaW5rIGZyb20gY3VycmVudFRhc2tzXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIEFsbExpbmtzLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgaGVscGVyLmRlbGV0ZUVsZW1lbnQoJ2N1cnJlbnRUYXNrcycsIGVsZW1lbnQuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTmV4dCwgaWYgZGVsZXRpbmcgbGluayB3YXMgc3VjY2Vzc2Z1bGxcclxuICAgICAgICAgICAgICAgICAgICBpZiAoQWxsTGlua3Muc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBtdXN0IGNyZWF0ZSBsaW5rIGluIGNvbXBsZXRlZFRhc2tzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBBbGxMaW5rcy5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBoZWxwZXIubGlua09iamVjdCgndGFza3MnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFza19pZDogdGFza0lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJfaWQ6IGVsZW1lbnQudXNlcl9pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6ICdjb21wbGV0ZWQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hhbmdlIHN0YXRlIG9mIG1haW4gZWxlbWVudHM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFN0YXRlc1tcImNvbXBsZXRlIHRhc2tcIl0oKVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaWRJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICAvLyByZXR1cm5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRhc2tCb3guaW5uZXJIVE1MID0gJ9CS0YvQv9C+0LvQvdGP0LXRgtGB0Y8g0L/QvtC40YHQui4nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCAxMDAwKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjbGVhckludGVydmFsKGlkSW50ZXJ2YWwpO1xyXG4gICAgICAgIHRhc2tCb3guaW5uZXJIVE1MID0gJ9CQ0LrRgtC40LLQvdGL0YUg0LfQsNC00LDRhyDQvdC10YIuINCS0YHRgtCw0L3RjNGC0LUg0L3QsCDQv9C+0LvRg9GH0LXQvdC40LUnO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGxhYmVsW2Zvcj0ke3RoaXMuaWR9XWApLnRleHRDb250ZW50ID0gJ9CS0YHRgtCw0YLRjCDQvdCwINC/0L7Qu9GD0YfQtdC90LjQtSc7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlVXBkYXRlTW92ZXIgPSBoZWxwZXIucGF0aE9iamVjdCgnbW92ZXJzJywgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2lkJyksIHtcclxuICAgICAgICAgICAgaXNFbmFibGVkOiAwXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5zdGF0dXNCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNyZWF0ZVdhaXRpbmdPZlRhc2spXHJcblxyXG5cclxuXHJcbi8vIEJ1dHRvbiB0aGF0IGFjdGl2YXRlcyBhY2NvdW50IG9mIG1vdmVyIHdpdGggdG9rZW5cclxuXHJcbmxldCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFtuYW1lPXRva2VuXVwiKTtcclxuXHJcbkJ1dHRvbkFjdGl2YXRlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgdG9rZW4gPSBudWxsO1xyXG4gICAgbGV0IHJlc3BvbnNlSUQgPSBudWxsO1xyXG4gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgaGVscGVyLmdldE9iamVjdEZyb21EYXRhKCd0b2tlbnNNb3ZlcnMnLCB7XHJcbiAgICAgICAgdXNlcl9pZDogbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2lkJylcclxuICAgIH0pXHJcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgIT0gMjAwKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICAgICAgQnV0dG9uQWN0aXZhdGUuaW5uZXJIVE1MID0gJ9Ce0YjQuNCx0LrQsCDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFLidcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0b2tlbiA9IHJlc3BvbnNlLmRhdGFbMF0udG9rZW5cclxuICAgIHJlc3BvbnNlSUQgPSByZXNwb25zZS5kYXRhWzBdLmlkXHJcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZUlEKVxyXG4gICAgY29uc29sZS5sb2codG9rZW4pXHJcbiAgICBjb25zb2xlLmxvZyhpbnB1dC52YWx1ZSlcclxuICAgIGlucHV0LnZhbHVlID0gaW5wdXQudmFsdWUudHJpbSgpXHJcbiAgICBpZiAodG9rZW4gPT0gaW5wdXQudmFsdWUpIHtcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBoZWxwZXIucGF0aE9iamVjdCgndG9rZW5zTW92ZXJzJywgcmVzcG9uc2VJRCwge1xyXG4gICAgICAgICAgICBJc1ZlcmlmaWVkOiAxXHJcbiAgICAgICAgfSlcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICAgICBpbnB1dC52YWx1ZSA9ICfQkNC60LrQsNGD0L3RgiDQsNC60YLQuNCy0LjRgNC+0LLQsNC9J1xyXG4gICAgICAgIEJ1dHRvbkFjdGl2YXRlLmRpc2FibGVkID0gdHJ1ZVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBCdXR0b25BY3RpdmF0ZS5pbm5lckhUTUwgPSAn0J3QtdCy0LXRgNC90YvQuSDRgtC+0LrQtdC9LidcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgQnV0dG9uQWN0aXZhdGUuaW5uZXJIVE1MID0gJ9CQ0LrRgtC40LLQuNGA0L7QstCw0YLRjCDQsNC60LrQsNGD0L3RgidcclxuICAgICAgICB9LCAyMDAwKVxyXG4gICAgfVxyXG59KSJdLCJmaWxlIjoidXNlci5qcyJ9
