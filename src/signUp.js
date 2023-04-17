import ApiHelper from "./js/ApiHelper.js";

let helper = new ApiHelper('http://logisticproject.ua');


let paragraph = document.querySelector('.form-interactive-box__indicator');
let form = document.querySelector('.conteiner-sing-up-form');

let radioButtons = form.querySelectorAll('input[type="radio"]');

let IsValid = {
    name: false,
    lastName: false,
    login: false,
    password: false,
}

form.name.addEventListener('input', () => {
    let label = form.querySelector('label[for=name]')
    console.log(form.name.value);
    if (form.name.value.length < 3) {
        IsValid.name = false;
        label.innerHTML = 'Эм, это точно ваше настоящее имя???'
        label.classList.add('label-show')
    } else {
        IsValid.name = true;
        label.innerHTML = 'Отлично!'
        label.classList.add('label-show')
    }
    console.log(IsValid.name);
})

form.lastName.addEventListener('input', () => {
    let label = form.querySelector('label[for=lastName]')
    console.log(form.lastName.value);
    if (form.lastName.value.length < 3) {
        IsValid.lastName = false;
        label.innerHTML = 'Сомневаюсь что ваша фамилия меньше 3-х символов.'
        label.classList.add('label-show')
    } else {
        IsValid.lastName = true;
        label.innerHTML = 'Отлично.'
        label.classList.add('label-show')
    }
    console.log(IsValid.lastName);
})

form.login.addEventListener('input', async () => {
    let id = null;
    for (const element of radioButtons) {
        if (element.checked) {
            id = element.id;
            break;
        }
    }
    let label = form.querySelector('label[for=login]')
    console.log(form.login.value);
    if (form.login.value.length < 6) {
        label.innerHTML = 'Логин должен быть не менее 6 символов!'
        label.classList.add('label-show')
        return;
    }
    let responseCode = await helper.getObjectFromData(id + 's', {
        login: form.login.value
    }, false);

    if (responseCode === 404) {
        IsValid.login = true;
        label.innerHTML = 'Отлично!'
        label.classList.add('label-show')
    } else if (responseCode === 200) {
        label.innerHTML = 'Такой логин уже зарегистрирован!'
        label.classList.add('label-show')
        IsValid.login = false;
    }
    console.log(IsValid.login);
})

form.password.addEventListener('input', () => {
    let label = form.querySelector('label[for=password]')
    console.log(form.password.value);
    if (form.password.value.length < 8) {
        IsValid.password = false;
        label.innerHTML = 'Пароль должен быть не менее 8 символов!'
        label.classList.add('label-show')
    } else {
        IsValid.password = true;
        label.innerHTML = 'Супер!'
        label.classList.add('label-show')
    }
    console.log(IsValid.login);
})
for (const element of radioButtons) {
    element.addEventListener('click', async () => {
        let label = form.querySelector('label[for=login]')
        let responseCode = await helper.getObjectFromData(element.id + 's', {
            login: form.login.value
        }, false);
        console.log(responseCode);
        if(responseCode === 200){
            IsValid.login = false;
            label.textContent = 'Такой логин уже зарегистрирован!'
        } else if (responseCode === 404){
            IsValid.login = true;
            label.textContent = 'Отлично!'
        }
    })
}
form.addEventListener('submit', (e) => {
    let id = null;
    for (const element of radioButtons) {
        if (element.checked) {
            id = element.id;
            break;
        }
    }
    e.preventDefault();
    console.log(IsValid)
    if (IsValid.name && IsValid.lastName && IsValid.login && IsValid.password && id) {
        let typeAccount = null;
        let OptionalParams = {
            name: form.name.value,
            lastName: form.lastName.value,
            login: form.login.value,
            password: form.password.value
        };
        if (id == 'mover') {
            OptionalParams.isEnabled = 0;
            typeAccount = 'mover';
        } else if (id == 'manager') {
            typeAccount = 'manager';
        }
        let promise = helper.postObjectJSON(id + 's', OptionalParams);

        promise.then((response) => {
            console.log(response);
            if (response.status === 201) {
                paragraph.innerHTML = 'Вы успешно зарегистрировались!'
                localStorage.setItem('login', form.login.value)
                localStorage.setItem('password', form.password.value)
                localStorage.setItem('type', typeAccount)
                localStorage.setItem('id', response.data.id)
                setTimeout(() => {
                    if (typeAccount === 'mover') {
                        window.location.href = 'user.html'
                    }
                    if (typeAccount === 'manager') {
                        window.location.href = 'profile.html'
                    }
                }, 1000)
            } else {
                paragraph.innerHTML = 'Произошла ошибка на стороне сервера. Попробуйте в другой раз!'
                console.log(response)
            }
        })
    } else {
        paragraph.innerHTML = 'Что-то заполнено не так. Обратите внимание на подсказки под каждым из полей ввода.'
    }
})