const CONF = {
    port: "5757",
    rootPathname: "./",
    appId: "wxf463e014415ddaef",
    appSecret: "38a7a3b1cdeab1df3f5c80341e7ff4cf",

    useQccloudLogin: true,

    mysql: {
        host: "localhost",
        port: 3306,
        user: "root",
        pass: "wxf463e014415ddaef",
        char: "utf8mb4"
    },

    cos: {
        region: "ap-guangzhou",
        fileBucket: "lp-1256514917",
        uploadFolder: "OBJ"
    },

    serverHost: "ndp6uzzo.qcloud.la",
    tunnelServerUrl: "https://ws.qcloud.com",
    tunnelSignatureKey: "$littleprog4me",
    qcloudAppId: "1256514917",
    qcloudSecretKey: "z1xbAf3ShDcqunUzMav66uWwAKMMWIvN",
    wxMessageToken: "9msg9",
    wxLoginExpires: 7200
    
}

module.exports = CONF;