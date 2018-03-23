
export default class fetchRequest {
    static sendRequest(url, params, method = 'POST') {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params)
            }).then(response => response.json())
                .then(data => {
                    console.log('请求已成功');
                    if (data.success) {
                        console.log(data);
                        resolve(data);
                    } else {
                        reject(data)
                    }
                }).catch(error => {
                    console.log(error);
                    reject({ msg: '网络超时！', error })
                })
        })
    }
}


