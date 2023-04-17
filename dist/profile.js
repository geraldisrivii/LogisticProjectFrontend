import ApiHelper from "./js/ApiHelper.js";

let helper = new ApiHelper('http://logisticproject.ua');
let createTokenForm = document.querySelector('.create-token-box');
let RadioButtonsAll = document.querySelectorAll('.radio-filter');
let statisticBox = document.querySelector('.statistic-box');
console.log(createTokenForm);

createTokenForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    let radioButtons = createTokenForm.querySelectorAll('input[type="radio"]');
    let id = null;
    for (const radioButton of radioButtons) {
        if (radioButton.checked == true) {
            id = radioButton.id;
            break;
        }
    }
    let responseUser = await helper.getObjectFromData(id + 's', {
        login: createTokenForm.login.value,
        password: createTokenForm.password.value
    });
    let user_id = responseUser.data[0].id
    let type = null;
    switch (id) {
        case 'manager':
            type = 'tokensManagers';
            break;
        case 'mover':
            type = 'tokensMovers';
            break;
    }
    let responseCreateToken = await helper.postObjectJSON(type, {
        user_id: user_id,
        token: Math.random().toString(36).slice(2, 9),
        isVerified: 0
    });
    console.log(responseCreateToken);
})

let inputParams = {
    type: '',
    period: ''
}

function loadData(){
    statisticBox.innerHTML = '';
}
console.log(RadioButtonsAll)
for (const RadioButton of RadioButtonsAll) {
    if(RadioButton.checked == true){
        inputParams[RadioButton.name] = RadioButton.id;
    }
    RadioButton.addEventListener('click', function () {
        inputParams[this.name] = this.id;
        console.log(inputParams);
    })
}
console.log(inputParams);


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJwcm9maWxlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBcGlIZWxwZXIgZnJvbSBcIi4vanMvQXBpSGVscGVyLmpzXCI7XHJcblxyXG5sZXQgaGVscGVyID0gbmV3IEFwaUhlbHBlcignaHR0cDovL2xvZ2lzdGljcHJvamVjdC51YScpO1xyXG5sZXQgY3JlYXRlVG9rZW5Gb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNyZWF0ZS10b2tlbi1ib3gnKTtcclxubGV0IFJhZGlvQnV0dG9uc0FsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yYWRpby1maWx0ZXInKTtcclxubGV0IHN0YXRpc3RpY0JveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdGF0aXN0aWMtYm94Jyk7XHJcbmNvbnNvbGUubG9nKGNyZWF0ZVRva2VuRm9ybSk7XHJcblxyXG5jcmVhdGVUb2tlbkZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgbGV0IHJhZGlvQnV0dG9ucyA9IGNyZWF0ZVRva2VuRm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwicmFkaW9cIl0nKTtcclxuICAgIGxldCBpZCA9IG51bGw7XHJcbiAgICBmb3IgKGNvbnN0IHJhZGlvQnV0dG9uIG9mIHJhZGlvQnV0dG9ucykge1xyXG4gICAgICAgIGlmIChyYWRpb0J1dHRvbi5jaGVja2VkID09IHRydWUpIHtcclxuICAgICAgICAgICAgaWQgPSByYWRpb0J1dHRvbi5pZDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IHJlc3BvbnNlVXNlciA9IGF3YWl0IGhlbHBlci5nZXRPYmplY3RGcm9tRGF0YShpZCArICdzJywge1xyXG4gICAgICAgIGxvZ2luOiBjcmVhdGVUb2tlbkZvcm0ubG9naW4udmFsdWUsXHJcbiAgICAgICAgcGFzc3dvcmQ6IGNyZWF0ZVRva2VuRm9ybS5wYXNzd29yZC52YWx1ZVxyXG4gICAgfSk7XHJcbiAgICBsZXQgdXNlcl9pZCA9IHJlc3BvbnNlVXNlci5kYXRhWzBdLmlkXHJcbiAgICBsZXQgdHlwZSA9IG51bGw7XHJcbiAgICBzd2l0Y2ggKGlkKSB7XHJcbiAgICAgICAgY2FzZSAnbWFuYWdlcic6XHJcbiAgICAgICAgICAgIHR5cGUgPSAndG9rZW5zTWFuYWdlcnMnO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdtb3Zlcic6XHJcbiAgICAgICAgICAgIHR5cGUgPSAndG9rZW5zTW92ZXJzJztcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICBsZXQgcmVzcG9uc2VDcmVhdGVUb2tlbiA9IGF3YWl0IGhlbHBlci5wb3N0T2JqZWN0SlNPTih0eXBlLCB7XHJcbiAgICAgICAgdXNlcl9pZDogdXNlcl9pZCxcclxuICAgICAgICB0b2tlbjogTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMiwgOSksXHJcbiAgICAgICAgaXNWZXJpZmllZDogMFxyXG4gICAgfSk7XHJcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZUNyZWF0ZVRva2VuKTtcclxufSlcclxuXHJcbmxldCBpbnB1dFBhcmFtcyA9IHtcclxuICAgIHR5cGU6ICcnLFxyXG4gICAgcGVyaW9kOiAnJ1xyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkRGF0YSgpe1xyXG4gICAgc3RhdGlzdGljQm94LmlubmVySFRNTCA9ICcnO1xyXG59XHJcbmNvbnNvbGUubG9nKFJhZGlvQnV0dG9uc0FsbClcclxuZm9yIChjb25zdCBSYWRpb0J1dHRvbiBvZiBSYWRpb0J1dHRvbnNBbGwpIHtcclxuICAgIGlmKFJhZGlvQnV0dG9uLmNoZWNrZWQgPT0gdHJ1ZSl7XHJcbiAgICAgICAgaW5wdXRQYXJhbXNbUmFkaW9CdXR0b24ubmFtZV0gPSBSYWRpb0J1dHRvbi5pZDtcclxuICAgIH1cclxuICAgIFJhZGlvQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlucHV0UGFyYW1zW3RoaXMubmFtZV0gPSB0aGlzLmlkO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGlucHV0UGFyYW1zKTtcclxuICAgIH0pXHJcbn1cclxuY29uc29sZS5sb2coaW5wdXRQYXJhbXMpO1xyXG5cclxuIl0sImZpbGUiOiJwcm9maWxlLmpzIn0=
