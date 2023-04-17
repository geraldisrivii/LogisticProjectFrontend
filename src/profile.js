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

