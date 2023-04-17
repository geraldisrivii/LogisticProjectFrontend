import ApiHelper from './js/ApiHelper.js';

let helper = new ApiHelper('http://logisticproject.ua');

let form = document.querySelector('.form');
let paragraph = document.querySelector('.conteiner-sign-in__paragraph');


form.addEventListener('submit', (e) => {
    e.preventDefault();
    let radioButtons = form.querySelectorAll('input[type="radio"]');
    let id = null;
    for (const radioButton of radioButtons) {
        if(radioButton.checked == true) {
            id = radioButton.id;
        }
    }
    let promise = helper.getObjectFromData(id + 's', {
        login: form.login.value,
        password: form.password.value
    }, true);
    promise.then((response) => {
        let code = response.status;
        let data = response.data;
        console.log(code);
        console.log(data);
        if (code === 200) {
            localStorage.setItem('login', form.login.value);
            localStorage.setItem('password', form.password.value);
            localStorage.setItem('type', id);
            localStorage.setItem('id', data[0].id);
            window.location.href = 'main.html';
        } else {
            paragraph.textContent = 'Неверный логин или пароль';
        }
    })
})