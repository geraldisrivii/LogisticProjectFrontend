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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXBpSGVscGVyIGZyb20gJy4vanMvQXBpSGVscGVyLmpzJztcclxuXHJcbmxldCBoZWxwZXIgPSBuZXcgQXBpSGVscGVyKCdodHRwOi8vbG9naXN0aWNwcm9qZWN0LnVhJyk7XHJcblxyXG5sZXQgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtJyk7XHJcbmxldCBwYXJhZ3JhcGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVpbmVyLXNpZ24taW5fX3BhcmFncmFwaCcpO1xyXG5cclxuXHJcbmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGUpID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGxldCByYWRpb0J1dHRvbnMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpO1xyXG4gICAgbGV0IGlkID0gbnVsbDtcclxuICAgIGZvciAoY29uc3QgcmFkaW9CdXR0b24gb2YgcmFkaW9CdXR0b25zKSB7XHJcbiAgICAgICAgaWYocmFkaW9CdXR0b24uY2hlY2tlZCA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGlkID0gcmFkaW9CdXR0b24uaWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IHByb21pc2UgPSBoZWxwZXIuZ2V0T2JqZWN0RnJvbURhdGEoaWQgKyAncycsIHtcclxuICAgICAgICBsb2dpbjogZm9ybS5sb2dpbi52YWx1ZSxcclxuICAgICAgICBwYXNzd29yZDogZm9ybS5wYXNzd29yZC52YWx1ZVxyXG4gICAgfSwgdHJ1ZSk7XHJcbiAgICBwcm9taXNlLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgbGV0IGNvZGUgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgbGV0IGRhdGEgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNvZGUpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIGlmIChjb2RlID09PSAyMDApIHtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xvZ2luJywgZm9ybS5sb2dpbi52YWx1ZSk7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwYXNzd29yZCcsIGZvcm0ucGFzc3dvcmQudmFsdWUpO1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndHlwZScsIGlkKTtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2lkJywgZGF0YVswXS5pZCk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ21haW4uaHRtbCc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcGFyYWdyYXBoLnRleHRDb250ZW50ID0gJ9Cd0LXQstC10YDQvdGL0Lkg0LvQvtCz0LjQvSDQuNC70Lgg0L/QsNGA0L7Qu9GMJztcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59KSJdLCJmaWxlIjoiaW5kZXguanMifQ==
