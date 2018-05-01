module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录态校验之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        var name = ctx.request.body.name || "";
        var date = ctx.request.body.date || "";
        var wAge = ctx.request.body.wAge || "";
        var telNumber = ctx.request.body.telNumber || "";
        var coType = {
            main: ctx.params.category,
            minor: ctx.params.subCategory
        };
        var userData = {
            name: name,
            date: date,
            wAge: wAge,
            telNumber: telNumber,
            coType: coType
        };
        //status代表信息录入状态1:success 0:failed
        ctx.state.userData = userData;
        ctx.state.code = 400;

        //model.sync();
        //model.User.create(userData);

        /*
        User = model.User;
        var exit = User.findAll({
            where: {
                tel_number: telNumber
            }
        })
        if(exit) {
            ctx.state.code = 200;
        } else {
            var user = await User.create(userDdate);
            db.sync();
            ctx.sate.userData = userData;
            ctx.state.code = 400;
        }
        */
    } else {
        ctx.state.code = -1
    }
}
