
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgQWNjb3VudE1hbmFnZXIgZnJvbSBcIi4vanMvQWNjb3VudE1hbmFnZXIuanNcIjtcclxubGV0IGFjY291bnRNYW5hZ2VyID0gbmV3IEFjY291bnRNYW5hZ2VyKCk7XHJcbmFjY291bnRNYW5hZ2VyLnZlcmlmeSgpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgIGlmKGRhdGEuc3RhdHVzID09IGZhbHNlIHx8IGRhdGEudHlwZSAhPSAnbWFuYWdlcicpIHtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICd1c2VyLmh0bWwnO1xyXG4gICAgfVxyXG59KVxyXG5cclxuXHJcblxyXG5pbXBvcnQgQXBpSGVscGVyIGZyb20gXCIuL2pzL0FwaUhlbHBlci5qc1wiO1xyXG5sZXQgY3VycmVudFRhc2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmN1cnJlbnQtdGFza3MnKTtcclxubGV0IGNvbXBsZXRlZFRhc2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbXBsZXRlZC10YXNrcycpO1xyXG5cclxuXHJcblxyXG5sZXQgaGVscGVyID0gbmV3IEFwaUhlbHBlcignaHR0cDovL2xvZ2lzdGljcHJvamVjdC51YS8nKTtcclxuXHJcbmxldCBwcm9taXNlQ3VycmVudFRhc2tzID0gaGVscGVyLmdldEFycmF5KCdjb252ZXJ0ZWRfQ3VycmVudFRhc2tzJyk7XHJcbmxldCBwcm9taXNlQ29tcGxldGVkVGFza3MgPSBoZWxwZXIuZ2V0QXJyYXkoJ2NvbnZlcnRlZF9Db21wbGV0ZWRUYXNrcycpO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gbG9hZFRhc2tzKGRhdGEsIGh0bWwsIGNvbnRhaW5lcikge1xyXG4gICAgaWYgKGRhdGEuc3RhdHVzICE9PSAyMDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBmb3IgKGNvbnN0IHRhc2sgb2YgZGF0YS5kYXRhKSB7XHJcbiAgICAgICAgbGV0IHBlb3BsZXNTdHJpbmcgPSAnJztcclxuICAgICAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgdGFzay5wZW9wbGVzKSB7XHJcbiAgICAgICAgICAgIHBlb3BsZXNTdHJpbmcgKz0gZWxlbWVudC5uYW1lICsgJyAnICsgZWxlbWVudC5sYXN0TmFtZSArICcsICc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBlb3BsZXNTdHJpbmcgPSBwZW9wbGVzU3RyaW5nLnNsaWNlKDAsIC0yKTtcclxuXHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBlbGVtZW50LmlkID0gdGFzay5pZDtcclxuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2N1cnJlbnQtdGFzaycpO1xyXG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndGFzaycpO1xyXG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gaHRtbDtcclxuICAgICAgICBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jdXJyZW50LXRhc2stZGVzY3JpcHRpb25fX2hlYWRlcicpLmlubmVySFRNTCA9IHRhc2sudGl0bGU7XHJcbiAgICAgICAgZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuY3VycmVudC10YXNrLWRlc2NyaXB0aW9uX19wcmljZScpLmlubmVySFRNTCA9IHRhc2sucHJpY2U7XHJcbiAgICAgICAgZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudGFzay1tYWluLWJveF9fbW92ZXJzJykuaW5uZXJIVE1MICs9IHBlb3BsZXNTdHJpbmc7XHJcblxyXG4gICAgICAgIC8vIEFkZCBmaW5hbHkgY29udmVydGVkIHRhc2tcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kKGVsZW1lbnQpO1xyXG4gICAgfVxyXG59XHJcbmxldCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwidGFzay1tYWluLWJveFwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInRhc2stZGVzY3JpcHRpb25cIj5cclxuICAgICAgICA8aDMgY2xhc3M9XCJjdXJyZW50LXRhc2stZGVzY3JpcHRpb25fX2hlYWRlclwiPjwvaDM+XHJcbiAgICAgICAgPHAgY2xhc3M9XCJjdXJyZW50LXRhc2stZGVzY3JpcHRpb25fX3ByaWNlXCI+PC9wPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8cCBjbGFzcz1cInRhc2stbWFpbi1ib3hfX21vdmVyc1wiPnBlb3BsZXM6IDwvcD5cclxuPC9kaXY+XHJcbjxidXR0b24gY2xhc3M9XCJ0YXNrX19idXR0b24gYnV0dG9uXCI+0J7RgtC80LXQvdC40YLRjDwvYnV0dG9uPmA7XHJcblxyXG5wcm9taXNlQ3VycmVudFRhc2tzLnRoZW4oKGRhdGEpID0+IGxvYWRUYXNrcyhkYXRhLCBodG1sLCBjdXJyZW50VGFza3MpKVxyXG5cclxucHJvbWlzZUNvbXBsZXRlZFRhc2tzLnRoZW4oKGRhdGEpID0+IHtcclxuICAgIGxldCBhcnJheSA9IGh0bWwuc3BsaXQoJ1xcbicpO1xyXG4gICAgYXJyYXkucG9wKClcclxuICAgIGh0bWwgPSBhcnJheS5qb2luKCdcXG4nKVxyXG4gICAgbG9hZFRhc2tzKGRhdGEsIGh0bWwsIGNvbXBsZXRlZFRhc2tzKVxyXG59KSJdLCJmaWxlIjoibWFpbi5qcyJ9
