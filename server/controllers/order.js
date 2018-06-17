const { mysql } = require("../qcloud");

const models = require("../model/index");

const getAll = async (ctx, next) => {
    const status = ctx.request.query.type;
    const user = Number(ctx.params.user);
    const query = {
        user_id: user,
        status: status
    }

    status === "all" && delete query.status;

    const page = Number(ctx.request.query.page) || 1;
    const limit = Number(ctx.request.query.limit) || 10;

    const offset = (page - 1) * limit;
    const order = ["create_at", "desc"];

    try {
        const  records = await mysql("order").count("user_id as records");
        const ret = await mysql("order").where(query).select().limit(limit).offset(offset).orderBy(...order);

        const hasNext = (records[0].records - offset) <= limit ? false : true;
        ctx.state.data = {
            items: ret,
            paginate: {
                page: page,
                limit: limit,
                hasNext: hasNext
            }
        }

        ctx.state.code = 200;
        ctx.state.message = "调用成功";
    } catch (err) {
        console.log(err)
    }
}

const get = async (ctx, next) => {
    const user = Number(ctx.params.user);
    const id = Number(ctx.params.id);

    const query = {
        _id: id,
        user_id: user
    }

    try {
        const ret = await mysql("order").where(query).select();

        if(!ret[0]) {
            ctx.state.code = 400;
            ctx.state.message = "资源不存在或已删除";
            ctx.state.data = null;
        } else {
            ctx.state.code = 200;
            ctx.state.message = "调用成功";
            ctx.state.data = ret[0];
        }
    } catch (err) {
        console.log(err);
        ctx.state.message = err
    }
}

const post = async (ctx, next) => {
    const user = Number(ctx.params.user);
    const address_id = Number(ctx.request.body.address_id);
    const body = {
        items: [],
        totalAmount: 0,
        user_id: user
    }

    const query = ctx.request.body.items.map(n => n.id);

    try {
        const ret1 = await mysql("address").where("_id", address_id).select();
        
        if(!ret1[0]) {
            ctx.state.code = 400;
            ctx.state.message = "地址不存在或已删除";
            ctx.state.data = null;
        } else {
            body.recipientName = ret1[0].name;
            body.recipientGender = ret1[0].gender;
            body.recipientTel = ret1[0].tel;
            body.recipientAddress = ret1[0].address;
            const ret2 = await mysql("goods").where("_id", "in", query).select();

            ret2.forEach(n => {
                const items = {
                    goods: n,
                    meta: {}
                }
                ctx.request.body.items.forEach(m => {
                    if(n._id.toString() === m.id.toString()) {
                        items.meta.total = Math.abs(m.total);
                        items.meta.totalAmount = Math.abs(n.price * m.total);
                        body.totalAmount += items.meta.totalAmount;
                    }
                })
                body.items.push(items);
            })

            body.items = JSON.stringify(body.items);

            const t = mysql.fn.now();
            body.create_at = t;
            const ret3 = await mysql("order").insert(body);

            const ret4 = await mysql("cart").whereIn("goods", query).andWhere({user:user}).del();

            ctx.state.code = 200;
            ctx.state.message = "新增成功";
            ctx.state.data = {
                _id: ret3[0]
            }
        }
    } catch (err) {
        console.log(err)
    }
}

const put = async (ctx, next) => {

}

const del = async (ctx, next) => {

}

module.exports = {
    getAll,
    get,
    post,
    put,
    del
}