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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcy9BY2NvdW50TWFuYWdlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXBpSGVscGVyIGZyb20gXCIuL0FwaUhlbHBlci5qc1wiO1xyXG5cclxuY2xhc3MgQWNjb3VudE1hbmFnZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5oZWxwZXIgPSBuZXcgQXBpSGVscGVyKCdodHRwOi8vbG9naXN0aWNwcm9qZWN0LnVhJyk7XHJcbiAgICB9XHJcbiAgICBhc3luYyB2ZXJpZnkoKSB7XHJcbiAgICAgICAgbGV0IGxvZ2luID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xvZ2luJylcclxuICAgICAgICBsZXQgcGFzc3dvcmQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncGFzc3dvcmQnKVxyXG4gICAgICAgIGxldCBpZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdpZCcpXHJcbiAgICAgICAgbGV0IHR5cGUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndHlwZScpXHJcbiAgICAgICAgbGV0IHVzZXIgPSBhd2FpdCB0aGlzLmhlbHBlci5nZXRPYmplY3QodHlwZSArICdzJywgaWQpXHJcbiAgICAgICAgaWYgKGxvZ2luID09IHVzZXIuZGF0YS5sb2dpbiAmJiBwYXNzd29yZCA9PSB1c2VyLmRhdGEucGFzc3dvcmQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXM6IHRydWUsIHR5cGU6IHR5cGV9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiBmYWxzZSwgdHlwZTogdHlwZX1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEFjY291bnRNYW5hZ2VyIl0sImZpbGUiOiJqcy9BY2NvdW50TWFuYWdlci5qcyJ9
