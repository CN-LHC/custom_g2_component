// let apiConfig = {
//     url: 'https://dtdataapi.wedengta.com/FinanceValue/FinanceValue',
//     method: 'post',
//     contentType: 'application/json',
//     body: {
//         date: new Date()
//     },
//     selectKeys: ['交易日期', '融券余额(亿元)', '融资余额(亿元)']
// }
export default function (apiConfig) {
    let options = {}
    options.method = apiConfig.method || 'POST'
    if (apiConfig.method && apiConfig.method.toUpperCase() === 'POST' || !apiConfig.method) {
        options.headers = {
            'content-type': apiConfig.contentType || 'application/json'
        }
        if (!apiConfig.contentType || apiConfig.contentType === 'application/json') {
            options.body = JSON.stringify(apiConfig.body)
        } else if (apiConfig.contentType === 'application/x-www-form-urlencoded'){
            let formData = new FormData();
            Object.keys(apiConfig.body).forEach((key) => {
                formData.append(key, apiConfig.body[key])
            })
            options.body = formData
        }
    }
    return fetch(apiConfig.url, options).then(response => response.json()).then((data) => {
        return data.data.map((item) => {
            let obj = {}
            apiConfig.selectKeys.forEach((value) => {
                obj[value] = item[value]
            })
            return obj
        })
    })
}