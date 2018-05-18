const { mysql } = require("../qcloud");

const memberUser = async (ctx, next) => {
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
            coType: coType,
            registered: true
        };

        var registeredStatus = {
            name: name,
            telNumber: telNumber,
            registered: true
        }
        //status代表信息录入状态1:success 0:failed
        ctx.state.registeredStatus = registeredStatus;
        ctx.state.data = userData;
        ctx.state.code = 200;

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

    await next();
}

const normalUser = async (ctx, next) => {
    const name = ctx.request.body.nickName;
    const body = {
        name: name
    }

    try {
        const ret = await mysql("user").returning("_id").insert(body);
        const feedValue = {
            _id: ret[0],
            name: name
        }
        if(!ret) {
            ctx.state.code = 400;
            ctx.state.message = "注册失败";
            cxt.state.data = null;
        } else {
            ctx.state.code = 200;
            ctx.state.message = "注册成功";
            ctx.state.data = feedValue;
        }
    } catch (err) {
        console.log(err);
    }
    await next();
}

module.exports = {
    memberUser,
    normalUser
}
