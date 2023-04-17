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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzaWduVXAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFwaUhlbHBlciBmcm9tIFwiLi9qcy9BcGlIZWxwZXIuanNcIjtcclxuXHJcbmxldCBoZWxwZXIgPSBuZXcgQXBpSGVscGVyKCdodHRwOi8vbG9naXN0aWNwcm9qZWN0LnVhJyk7XHJcblxyXG5cclxubGV0IHBhcmFncmFwaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtLWludGVyYWN0aXZlLWJveF9faW5kaWNhdG9yJyk7XHJcbmxldCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRlaW5lci1zaW5nLXVwLWZvcm0nKTtcclxuXHJcbmxldCByYWRpb0J1dHRvbnMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpO1xyXG5cclxubGV0IElzVmFsaWQgPSB7XHJcbiAgICBuYW1lOiBmYWxzZSxcclxuICAgIGxhc3ROYW1lOiBmYWxzZSxcclxuICAgIGxvZ2luOiBmYWxzZSxcclxuICAgIHBhc3N3b3JkOiBmYWxzZSxcclxufVxyXG5cclxuZm9ybS5uYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xyXG4gICAgbGV0IGxhYmVsID0gZm9ybS5xdWVyeVNlbGVjdG9yKCdsYWJlbFtmb3I9bmFtZV0nKVxyXG4gICAgY29uc29sZS5sb2coZm9ybS5uYW1lLnZhbHVlKTtcclxuICAgIGlmIChmb3JtLm5hbWUudmFsdWUubGVuZ3RoIDwgMykge1xyXG4gICAgICAgIElzVmFsaWQubmFtZSA9IGZhbHNlO1xyXG4gICAgICAgIGxhYmVsLmlubmVySFRNTCA9ICfQrdC8LCDRjdGC0L4g0YLQvtGH0L3QviDQstCw0YjQtSDQvdCw0YHRgtC+0Y/RidC10LUg0LjQvNGPPz8/J1xyXG4gICAgICAgIGxhYmVsLmNsYXNzTGlzdC5hZGQoJ2xhYmVsLXNob3cnKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBJc1ZhbGlkLm5hbWUgPSB0cnVlO1xyXG4gICAgICAgIGxhYmVsLmlubmVySFRNTCA9ICfQntGC0LvQuNGH0L3QviEnXHJcbiAgICAgICAgbGFiZWwuY2xhc3NMaXN0LmFkZCgnbGFiZWwtc2hvdycpXHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZyhJc1ZhbGlkLm5hbWUpO1xyXG59KVxyXG5cclxuZm9ybS5sYXN0TmFtZS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHtcclxuICAgIGxldCBsYWJlbCA9IGZvcm0ucXVlcnlTZWxlY3RvcignbGFiZWxbZm9yPWxhc3ROYW1lXScpXHJcbiAgICBjb25zb2xlLmxvZyhmb3JtLmxhc3ROYW1lLnZhbHVlKTtcclxuICAgIGlmIChmb3JtLmxhc3ROYW1lLnZhbHVlLmxlbmd0aCA8IDMpIHtcclxuICAgICAgICBJc1ZhbGlkLmxhc3ROYW1lID0gZmFsc2U7XHJcbiAgICAgICAgbGFiZWwuaW5uZXJIVE1MID0gJ9Ch0L7QvNC90LXQstCw0Y7RgdGMINGH0YLQviDQstCw0YjQsCDRhNCw0LzQuNC70LjRjyDQvNC10L3RjNGI0LUgMy3RhSDRgdC40LzQstC+0LvQvtCyLidcclxuICAgICAgICBsYWJlbC5jbGFzc0xpc3QuYWRkKCdsYWJlbC1zaG93JylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgSXNWYWxpZC5sYXN0TmFtZSA9IHRydWU7XHJcbiAgICAgICAgbGFiZWwuaW5uZXJIVE1MID0gJ9Ce0YLQu9C40YfQvdC+LidcclxuICAgICAgICBsYWJlbC5jbGFzc0xpc3QuYWRkKCdsYWJlbC1zaG93JylcclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKElzVmFsaWQubGFzdE5hbWUpO1xyXG59KVxyXG5cclxuZm9ybS5sb2dpbi5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGFzeW5jICgpID0+IHtcclxuICAgIGxldCBpZCA9IG51bGw7XHJcbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgcmFkaW9CdXR0b25zKSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQuY2hlY2tlZCkge1xyXG4gICAgICAgICAgICBpZCA9IGVsZW1lbnQuaWQ7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGxldCBsYWJlbCA9IGZvcm0ucXVlcnlTZWxlY3RvcignbGFiZWxbZm9yPWxvZ2luXScpXHJcbiAgICBjb25zb2xlLmxvZyhmb3JtLmxvZ2luLnZhbHVlKTtcclxuICAgIGlmIChmb3JtLmxvZ2luLnZhbHVlLmxlbmd0aCA8IDYpIHtcclxuICAgICAgICBsYWJlbC5pbm5lckhUTUwgPSAn0JvQvtCz0LjQvSDQtNC+0LvQttC10L0g0LHRi9GC0Ywg0L3QtSDQvNC10L3QtdC1IDYg0YHQuNC80LLQvtC70L7QsiEnXHJcbiAgICAgICAgbGFiZWwuY2xhc3NMaXN0LmFkZCgnbGFiZWwtc2hvdycpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IHJlc3BvbnNlQ29kZSA9IGF3YWl0IGhlbHBlci5nZXRPYmplY3RGcm9tRGF0YShpZCArICdzJywge1xyXG4gICAgICAgIGxvZ2luOiBmb3JtLmxvZ2luLnZhbHVlXHJcbiAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgaWYgKHJlc3BvbnNlQ29kZSA9PT0gNDA0KSB7XHJcbiAgICAgICAgSXNWYWxpZC5sb2dpbiA9IHRydWU7XHJcbiAgICAgICAgbGFiZWwuaW5uZXJIVE1MID0gJ9Ce0YLQu9C40YfQvdC+ISdcclxuICAgICAgICBsYWJlbC5jbGFzc0xpc3QuYWRkKCdsYWJlbC1zaG93JylcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2VDb2RlID09PSAyMDApIHtcclxuICAgICAgICBsYWJlbC5pbm5lckhUTUwgPSAn0KLQsNC60L7QuSDQu9C+0LPQuNC9INGD0LbQtSDQt9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0L0hJ1xyXG4gICAgICAgIGxhYmVsLmNsYXNzTGlzdC5hZGQoJ2xhYmVsLXNob3cnKVxyXG4gICAgICAgIElzVmFsaWQubG9naW4gPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKElzVmFsaWQubG9naW4pO1xyXG59KVxyXG5cclxuZm9ybS5wYXNzd29yZC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHtcclxuICAgIGxldCBsYWJlbCA9IGZvcm0ucXVlcnlTZWxlY3RvcignbGFiZWxbZm9yPXBhc3N3b3JkXScpXHJcbiAgICBjb25zb2xlLmxvZyhmb3JtLnBhc3N3b3JkLnZhbHVlKTtcclxuICAgIGlmIChmb3JtLnBhc3N3b3JkLnZhbHVlLmxlbmd0aCA8IDgpIHtcclxuICAgICAgICBJc1ZhbGlkLnBhc3N3b3JkID0gZmFsc2U7XHJcbiAgICAgICAgbGFiZWwuaW5uZXJIVE1MID0gJ9Cf0LDRgNC+0LvRjCDQtNC+0LvQttC10L0g0LHRi9GC0Ywg0L3QtSDQvNC10L3QtdC1IDgg0YHQuNC80LLQvtC70L7QsiEnXHJcbiAgICAgICAgbGFiZWwuY2xhc3NMaXN0LmFkZCgnbGFiZWwtc2hvdycpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIElzVmFsaWQucGFzc3dvcmQgPSB0cnVlO1xyXG4gICAgICAgIGxhYmVsLmlubmVySFRNTCA9ICfQodGD0L/QtdGAISdcclxuICAgICAgICBsYWJlbC5jbGFzc0xpc3QuYWRkKCdsYWJlbC1zaG93JylcclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKElzVmFsaWQubG9naW4pO1xyXG59KVxyXG5mb3IgKGNvbnN0IGVsZW1lbnQgb2YgcmFkaW9CdXR0b25zKSB7XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGxldCBsYWJlbCA9IGZvcm0ucXVlcnlTZWxlY3RvcignbGFiZWxbZm9yPWxvZ2luXScpXHJcbiAgICAgICAgbGV0IHJlc3BvbnNlQ29kZSA9IGF3YWl0IGhlbHBlci5nZXRPYmplY3RGcm9tRGF0YShlbGVtZW50LmlkICsgJ3MnLCB7XHJcbiAgICAgICAgICAgIGxvZ2luOiBmb3JtLmxvZ2luLnZhbHVlXHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlQ29kZSk7XHJcbiAgICAgICAgaWYocmVzcG9uc2VDb2RlID09PSAyMDApe1xyXG4gICAgICAgICAgICBJc1ZhbGlkLmxvZ2luID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gJ9Ci0LDQutC+0Lkg0LvQvtCz0LjQvSDRg9C20LUg0LfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNC9ISdcclxuICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlQ29kZSA9PT0gNDA0KXtcclxuICAgICAgICAgICAgSXNWYWxpZC5sb2dpbiA9IHRydWU7XHJcbiAgICAgICAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gJ9Ce0YLQu9C40YfQvdC+ISdcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcbmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGUpID0+IHtcclxuICAgIGxldCBpZCA9IG51bGw7XHJcbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgcmFkaW9CdXR0b25zKSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQuY2hlY2tlZCkge1xyXG4gICAgICAgICAgICBpZCA9IGVsZW1lbnQuaWQ7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGNvbnNvbGUubG9nKElzVmFsaWQpXHJcbiAgICBpZiAoSXNWYWxpZC5uYW1lICYmIElzVmFsaWQubGFzdE5hbWUgJiYgSXNWYWxpZC5sb2dpbiAmJiBJc1ZhbGlkLnBhc3N3b3JkICYmIGlkKSB7XHJcbiAgICAgICAgbGV0IHR5cGVBY2NvdW50ID0gbnVsbDtcclxuICAgICAgICBsZXQgT3B0aW9uYWxQYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6IGZvcm0ubmFtZS52YWx1ZSxcclxuICAgICAgICAgICAgbGFzdE5hbWU6IGZvcm0ubGFzdE5hbWUudmFsdWUsXHJcbiAgICAgICAgICAgIGxvZ2luOiBmb3JtLmxvZ2luLnZhbHVlLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogZm9ybS5wYXNzd29yZC52YWx1ZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGlkID09ICdtb3ZlcicpIHtcclxuICAgICAgICAgICAgT3B0aW9uYWxQYXJhbXMuaXNFbmFibGVkID0gMDtcclxuICAgICAgICAgICAgdHlwZUFjY291bnQgPSAnbW92ZXInO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaWQgPT0gJ21hbmFnZXInKSB7XHJcbiAgICAgICAgICAgIHR5cGVBY2NvdW50ID0gJ21hbmFnZXInO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcHJvbWlzZSA9IGhlbHBlci5wb3N0T2JqZWN0SlNPTihpZCArICdzJywgT3B0aW9uYWxQYXJhbXMpO1xyXG5cclxuICAgICAgICBwcm9taXNlLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAxKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhZ3JhcGguaW5uZXJIVE1MID0gJ9CS0Ysg0YPRgdC/0LXRiNC90L4g0LfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNC70LjRgdGMISdcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsb2dpbicsIGZvcm0ubG9naW4udmFsdWUpXHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncGFzc3dvcmQnLCBmb3JtLnBhc3N3b3JkLnZhbHVlKVxyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3R5cGUnLCB0eXBlQWNjb3VudClcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdpZCcsIHJlc3BvbnNlLmRhdGEuaWQpXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZUFjY291bnQgPT09ICdtb3ZlcicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAndXNlci5odG1sJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZUFjY291bnQgPT09ICdtYW5hZ2VyJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdwcm9maWxlLmh0bWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgMTAwMClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBhcmFncmFwaC5pbm5lckhUTUwgPSAn0J/RgNC+0LjQt9C+0YjQu9CwINC+0YjQuNCx0LrQsCDQvdCwINGB0YLQvtGA0L7QvdC1INGB0LXRgNCy0LXRgNCwLiDQn9C+0L/RgNC+0LHRg9C50YLQtSDQsiDQtNGA0YPQs9C+0Lkg0YDQsNC3ISdcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcGFyYWdyYXBoLmlubmVySFRNTCA9ICfQp9GC0L4t0YLQviDQt9Cw0L/QvtC70L3QtdC90L4g0L3QtSDRgtCw0LouINCe0LHRgNCw0YLQuNGC0LUg0LLQvdC40LzQsNC90LjQtSDQvdCwINC/0L7QtNGB0LrQsNC30LrQuCDQv9C+0LQg0LrQsNC20LTRi9C8INC40Lcg0L/QvtC70LXQuSDQstCy0L7QtNCwLidcclxuICAgIH1cclxufSkiXSwiZmlsZSI6InNpZ25VcC5qcyJ9
