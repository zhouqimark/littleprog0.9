const { mysql } = require("../qcloud");
const WXBizDataCrypt = require("../tools/WXBizDataCrypt");

module.exports = async (ctx, next) => {
    const encryptedData = ctx.request.body.encryptedData;
    const iv = ctx.request.body.iv;

    const openId = ctx.state.$wxInfo.userinfo.openId;

    var row = await mysql("cSessionInfo").where({ open_id : openId}).first();
    var sk = row.session_key;

    var appId = ctx.state.$wxInfo.userinfo.watermark.appid;

    var pc = new WXBizDataCrypt(appId, sk);

    var data = pc.decryptData(encryptedData , iv);

    ctx.state.decryptedData = data;
}