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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcmVhdGVFbGVtZW50LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBcGlIZWxwZXIgZnJvbSAnLi9qcy9BcGlIZWxwZXIuanMnO1xyXG5cclxubGV0IHVzZXJUeXBlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3R5cGUnKTtcclxuXHJcbmlmKHVzZXJUeXBlID09IG51bGwgfHwgdXNlclR5cGUgPT0gJ21vdmVyJyl7XHJcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICd1c2VyLmh0bWwnO1xyXG59XHJcblxyXG5sZXQgaGVscGVyID0gbmV3IEFwaUhlbHBlcignaHR0cDovL2xvZ2lzdGljcHJvamVjdC51YScpO1xyXG5cclxubGV0IG1vdmVyRm9ybUJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb3Zlci1mb3JtLWJveCcpO1xyXG5cclxubGV0IENyZWF0ZVRhc2tzRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdDcmVhdGVUYXNrc0Zvcm0nKTtcclxuXHJcbmxldCBjcmVhdGVUYXNrQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NyZWF0ZVRhc2tCdXR0b24nKTtcclxuXHJcbmxldCBwcm9taXNlTW92ZXJzID0gaGVscGVyLmdldE9iamVjdEZyb21EYXRhKCdtb3ZlcnMnLCB7XHJcbiAgICBpc0VuYWJsZWQ6IDFcclxufSlcclxuXHJcbnByb21pc2VNb3ZlcnMudGhlbihkYXRhID0+IHtcclxuICAgIGlmIChkYXRhLnN0YXR1cyAhPT0gMjAwKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YS5kYXRhKTtcclxuICAgICAgICBtb3ZlckZvcm1Cb3guaW5uZXJIVE1MID0gXCLQldGJ0LUg0L3QuCDQvtC00LjQvSDRgNCw0LHQvtGC0L3QuNC6INC90LUg0LLRi9GI0LXQuyDQvdCwINGB0LzQtdC90YMuIFwiO1xyXG4gICAgICAgIGNyZWF0ZVRhc2tCdXR0b24uZGlzYWJsZWQgPSB0cnVlXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZm9yIChjb25zdCBtb3ZlciBvZiBkYXRhLmRhdGEpIHtcclxuICAgICAgICBtb3ZlckZvcm1Cb3guaW5uZXJIVE1MICs9IGA8ZGl2IGNsYXNzPVwicGVvcGxlQm94XCI+XHJcbiAgICAgICAgPGlucHV0IGNsYXNzPVwicGVvcGxlQm94X19jaGVja2JveFwiIHR5cGU9XCJjaGVja2JveFwiIGlkPVwiJHttb3Zlci5pZH1cIj5cclxuICAgICAgICA8bGFiZWwgY2xhc3M9XCJwZW9wbGVCb3hfX2xhYmVsXCIgZm9yPVwiJHttb3Zlci5pZH1cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlkLWNhcmRcIj5cclxuICAgICAgICAgICAgICAgIDxoMyBjbGFzcz1cImlkLWNhcmRfX2hlYWRlclwiPiR7bW92ZXIubmFtZX08L2gzPlxyXG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJpZC1jYXJkX190ZXh0XCI+JHttb3Zlci5sYXN0TmFtZX08L3A+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvbGFiZWw+XHJcbiAgICA8L2Rpdj5gXHJcbiAgICB9XHJcbn0pXHJcbmNvbnNvbGUubG9nKENyZWF0ZVRhc2tzRm9ybSlcclxuQ3JlYXRlVGFza3NGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGlmIChtb3ZlckZvcm1Cb3gucXVlcnlTZWxlY3RvcignLnBlb3BsZUJveF9fY2hlY2tib3gnKS5jaGVja2VkID09IGZhbHNlKSB7XHJcbiAgICAgICAgQ3JlYXRlVGFza3NGb3JtLnF1ZXJ5U2VsZWN0b3IoJy5tYWluLWZvcm0tYm94LXBhcmFncmFwaCcpLnRleHRDb250ZW50ID0gJ9Cd0LUg0LLRi9Cx0YDQsNC9INC90Lgg0L7QtNC40L0g0YDQsNCx0L7RgtC90LjQuic7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IGNvdW50ID0gbW92ZXJGb3JtQm94LmNoaWxkcmVuLmxlbmd0aDtcclxuICAgIGxldCBDaG9vc2VuTW92ZXJzID0gW107XHJcbiAgICBmb3IgKGNvbnN0IGNoZWNrYm94IG9mIG1vdmVyRm9ybUJveC5xdWVyeVNlbGVjdG9yQWxsKCcucGVvcGxlQm94X19jaGVja2JveCcpKSB7XHJcbiAgICAgICAgaWYoY2hlY2tib3guY2hlY2tlZCl7XHJcbiAgICAgICAgICAgIENob29zZW5Nb3ZlcnMucHVzaChjaGVja2JveC5pZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaGVscGVyLnBvc3RPYmplY3RGb3JtRGF0YSgndGFza3MnLCBDcmVhdGVUYXNrc0Zvcm0pLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgZm9yIChjb25zdCBpZCBvZiBDaG9vc2VuTW92ZXJzKSB7XHJcbiAgICAgICAgICAgIGhlbHBlci5saW5rT2JqZWN0KCd0YXNrcycsIHtcclxuICAgICAgICAgICAgICAgIHVzZXJfaWQ6IGlkLFxyXG4gICAgICAgICAgICAgICAgdGFza19pZDogZGF0YS5kYXRhLmlkLFxyXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAnY3VycmVudCcsXHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDBcclxuICAgICAgICAgICAgfSkudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICAvKiB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdtYWluLmh0bWwnOyAqL1xyXG4gICAgfSlcclxufSkiXSwiZmlsZSI6ImNyZWF0ZUVsZW1lbnQuanMifQ==
