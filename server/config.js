const CONF = {
    port: "5757",
    appId: "wxf463e014415ddaef",
    appSecret: "38a7a3b1cdeab1df3f5c80341e7ff4cf",

    useQcloudLogin: true,

    mysql: {
        host: "localhost",
        port: 3306,
        user: "root",
        pass: "wxf463e014415ddaef",
        db: "cAuth",
        char: "utf8mb4"
    },

    cos: {
        region: "ap-guangzhou",
        fileBucket: "lp-1256514917",
        uploadFolder: "OBJ"
    },

    serverHost: "ndp6uzzo.qcloud.la",
    tunnelServerUrl: "ndp6uzzo.ws.qcloud.la",
    tunnelSignatureKey: "$littleprog4me",
    qcloudAppId: "1256514917",
    qcloudSecretId: "AKIDSn9OSM6lKi0hYKqKWbUoFYgusGZkhnGE",
    qcloudSecretKey: "z1xbAf3ShDcqunUzMav66uWwAKMMWIvN",
    wxMessageToken: "msg2u",
    wxLoginExpires: 7200
    
}

module.exports = CONF;