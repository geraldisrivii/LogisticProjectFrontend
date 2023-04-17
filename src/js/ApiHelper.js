class ApiHelper {
    constructor(url) {
        if (url.slice(-1) !== '/') {
            url += '/';
        }
        this.url = url;
    }
    async deleteElement(type, id) {
        if (type.slice(-1) !== '/') {
            type += '/';
        }
        return fetch(this.url + type + id, {
            method: 'DELETE'
        }).then(response => {
            return response.json().then(data => {
                return { data: data, status: response.status };
            })
        })
    }
    async getArray(type) {
        return fetch(this.url + type).then(response => {
            return response.json().then(data => {
                return { data: data, status: response.status };
            })
        });
    }
    async getObject(type, id) {
        if (type.slice(-1) !== '/') {
            type += '/';
        }
        return fetch(this.url + type + id).then(response => {
            return response.json().then(data => {
                return { data: data, status: response.status };
            })
        });
    }
    async getObjectFromData(type, object, IsData = true, isStatus = true) {
        let querryString = '';
        for (const key in object) {
            querryString += key + '=' + object[key] + '&';
        }
        querryString = querryString.slice(0, -1);
        return fetch(this.url + type + '?' + querryString, {
            method: 'GET'
        }).then(async (response) => {
            if (IsData == true) {
                return await response.json().then(data => {
                    return { data: data, status: response.status };
                })
            } else if(IsData == true, isStatus == false){
                return response.json();
            }
            else {
                return response.status;
            }
        })
    }

    /**
     * @param {string} type 
     * @param {FormData} form 
     */
    async postObjectFormData(type, form, compementaryValuesObject) {
        let formData = new FormData(form)
        for (const key in compementaryValuesObject) {
            formData.append(key, compementaryValuesObject[key]);
        }
        let promise = fetch(this.url + type, {
            method: 'POST',
            body: formData
        }).then(response => {
            return response.json().then(data => {
                return { data: data, status: response.status };
            })
        })

        return await promise;
    }

    async postObjectJSON(type, object) {
        let promise = fetch(this.url + type, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        }).then(response => {
            return response.json().then(data => {
                return { data: data, status: response.status };
            })
        })

        return await promise;
    }
    async linkObject(type, object) {
        if (type.slice(-1) !== '/') {
            type += '/';
        }
        let promise = fetch(this.url + type + object.task_id + '/' + object.user_id + '/' + object.filter, {
            method: 'LINK'
        }).then(response => {
            return response.json().then(data => {
                return { data: data, status: response.status };
            })
        })

        return await promise;
    }
    async pathObject(type, id, object) {
        if (type.slice(-1) !== '/') {
            type += '/';
        }
        return fetch(this.url + type + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        }).then(response => {
            return response.json().then(data => {
                return { data: data, status: response.status };
            })
        })
    }
}

export default ApiHelper