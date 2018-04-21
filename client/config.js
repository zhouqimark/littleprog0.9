var host = "https://ndp6uzzo.qcloud.la";

var config = {
    service: {
        host,
        loginUrl: `${host}/weapp/login`,
        requestUrl: `${host}/weapp/user`
    }
}

module.exports = config;