import ApiHelper from "./ApiHelper.js";

class AccountManager {
    constructor() {
        this.helper = new ApiHelper('http://logisticproject.ua');
    }
    async verify() {
        let login = localStorage.getItem('login')
        let password = localStorage.getItem('password')
        let id = localStorage.getItem('id')
        let type = localStorage.getItem('type')
        let user = await this.helper.getObject(type + 's', id)
        if (login == user.data.login && password == user.data.password) {
            return {status: true, type: type}

        } else {
            return {status: false, type: type}
        }
    }
}

export default AccountManager