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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcy9BcGlIZWxwZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQXBpSGVscGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHVybCkge1xyXG4gICAgICAgIGlmICh1cmwuc2xpY2UoLTEpICE9PSAnLycpIHtcclxuICAgICAgICAgICAgdXJsICs9ICcvJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICB9XHJcbiAgICBhc3luYyBkZWxldGVFbGVtZW50KHR5cGUsIGlkKSB7XHJcbiAgICAgICAgaWYgKHR5cGUuc2xpY2UoLTEpICE9PSAnLycpIHtcclxuICAgICAgICAgICAgdHlwZSArPSAnLyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmZXRjaCh0aGlzLnVybCArIHR5cGUgKyBpZCwge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnXHJcbiAgICAgICAgfSkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IGRhdGEsIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzIH07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIGFzeW5jIGdldEFycmF5KHR5cGUpIHtcclxuICAgICAgICByZXR1cm4gZmV0Y2godGhpcy51cmwgKyB0eXBlKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogZGF0YSwgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMgfTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIGdldE9iamVjdCh0eXBlLCBpZCkge1xyXG4gICAgICAgIGlmICh0eXBlLnNsaWNlKC0xKSAhPT0gJy8nKSB7XHJcbiAgICAgICAgICAgIHR5cGUgKz0gJy8nO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmV0Y2godGhpcy51cmwgKyB0eXBlICsgaWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiBkYXRhLCBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyB9O1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgZ2V0T2JqZWN0RnJvbURhdGEodHlwZSwgb2JqZWN0LCBJc0RhdGEgPSB0cnVlLCBpc1N0YXR1cyA9IHRydWUpIHtcclxuICAgICAgICBsZXQgcXVlcnJ5U3RyaW5nID0gJyc7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gb2JqZWN0KSB7XHJcbiAgICAgICAgICAgIHF1ZXJyeVN0cmluZyArPSBrZXkgKyAnPScgKyBvYmplY3Rba2V5XSArICcmJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcXVlcnJ5U3RyaW5nID0gcXVlcnJ5U3RyaW5nLnNsaWNlKDAsIC0xKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godGhpcy51cmwgKyB0eXBlICsgJz8nICsgcXVlcnJ5U3RyaW5nLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCdcclxuICAgICAgICB9KS50aGVuKGFzeW5jIChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoSXNEYXRhID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCByZXNwb25zZS5qc29uKCkudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiBkYXRhLCBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyB9O1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSBlbHNlIGlmKElzRGF0YSA9PSB0cnVlLCBpc1N0YXR1cyA9PSBmYWxzZSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBcclxuICAgICAqIEBwYXJhbSB7Rm9ybURhdGF9IGZvcm0gXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHBvc3RPYmplY3RGb3JtRGF0YSh0eXBlLCBmb3JtLCBjb21wZW1lbnRhcnlWYWx1ZXNPYmplY3QpIHtcclxuICAgICAgICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSlcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBjb21wZW1lbnRhcnlWYWx1ZXNPYmplY3QpIHtcclxuICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKGtleSwgY29tcGVtZW50YXJ5VmFsdWVzT2JqZWN0W2tleV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcHJvbWlzZSA9IGZldGNoKHRoaXMudXJsICsgdHlwZSwge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgYm9keTogZm9ybURhdGFcclxuICAgICAgICB9KS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogZGF0YSwgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMgfTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXR1cm4gYXdhaXQgcHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBwb3N0T2JqZWN0SlNPTih0eXBlLCBvYmplY3QpIHtcclxuICAgICAgICBsZXQgcHJvbWlzZSA9IGZldGNoKHRoaXMudXJsICsgdHlwZSwge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShvYmplY3QpXHJcbiAgICAgICAgfSkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IGRhdGEsIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzIH07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IHByb21pc2U7XHJcbiAgICB9XHJcbiAgICBhc3luYyBsaW5rT2JqZWN0KHR5cGUsIG9iamVjdCkge1xyXG4gICAgICAgIGlmICh0eXBlLnNsaWNlKC0xKSAhPT0gJy8nKSB7XHJcbiAgICAgICAgICAgIHR5cGUgKz0gJy8nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcHJvbWlzZSA9IGZldGNoKHRoaXMudXJsICsgdHlwZSArIG9iamVjdC50YXNrX2lkICsgJy8nICsgb2JqZWN0LnVzZXJfaWQgKyAnLycgKyBvYmplY3QuZmlsdGVyLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0xJTksnXHJcbiAgICAgICAgfSkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IGRhdGEsIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzIH07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IHByb21pc2U7XHJcbiAgICB9XHJcbiAgICBhc3luYyBwYXRoT2JqZWN0KHR5cGUsIGlkLCBvYmplY3QpIHtcclxuICAgICAgICBpZiAodHlwZS5zbGljZSgtMSkgIT09ICcvJykge1xyXG4gICAgICAgICAgICB0eXBlICs9ICcvJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHRoaXMudXJsICsgdHlwZSArIGlkLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BBVENIJyxcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShvYmplY3QpXHJcbiAgICAgICAgfSkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IGRhdGEsIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzIH07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQXBpSGVscGVyIl0sImZpbGUiOiJqcy9BcGlIZWxwZXIuanMifQ==
