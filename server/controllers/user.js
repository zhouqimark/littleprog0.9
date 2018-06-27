const { mysql } = require("../qcloud");

const memberUser = async (ctx, next) => {
    // 通过 Koa 中间件进行登录态校验之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState === 1) {
        const user_id = Number(ctx.params.user);
        const update_at = mysql.fn.now();
        const name = ctx.state.$wxInfo.userinfo.nickName;
        const avatar = ctx.state.$wxInfo.userinfo.avatarUrl;
        const query = {
            _id: user_id
        }

        const body = {
            name: name,
            avatar: avatar,
            member_ship: 1,
            update_at: update_at
        }
        try{
            const ret = await mysql("user").where(query).update(body);
            const feedValue = await mysql("user").where(query).select();
            
            if(!feedValue[0]) {
                ctx.state.code = 400;
                ctx.state.message = "会员注册失败";
                ctx.state.data = null;
            } else {
                ctx.state.code = 200;
                ctx.state.message = "你好，会员";
                ctx.state.data = feedValue[0];
            }
        } catch (err) {
            ctx.state.message = err;
            console.log(err);
        }
    } else {
        ctx.state.code = -1
    }

    await next();
}

const normalUser = async (ctx, next) => {
    const name = new Date().getTime().toString();
    const create_at = mysql.fn.now();
    const body = {
        name: name,
        create_at: create_at
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
            ctx.state.message = "欢迎";
            ctx.state.data = feedValue;
        }
    } catch (err) {
        console.log(err);
        ctx.state.message = err;
    }
    await next();
}

module.exports = {
    memberUser,
    normalUser
}
