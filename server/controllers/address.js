const  { mysql } = require("../qcloud");

const setDefault = async (ctx, next) => {
    const id = Number(ctx.params.id);
    const user = Number(ctx.params.user);

    const query = {
        is_def: true,
        user_id: user
    }

    const update = {
        is_def: false
    }

    try {
        const ret = await mysql("address").where(query).update(update);

        if(ret !== undeifned){
            const feedValue = await mysql("address").where({_id: id}).update({is_def: true});
            
            if(feedValue === undefined) {
                ctx.state.code = 400;
                ctx.state.message = "资源不存在或已删除";
                ctx.state.data = null;
            } else {
                ctx.state.code = 200;
                ctx.state.message = "调用成功";
                ctx.state.data =  {
                    feedValue,
                }
            }
            
        } else {
            ctx.state.code = 400;
            ctx.state.message = "资源不存在或已删除";
            ctx.state.data = null;
        }
    } catch (err) {
        console.log(err);
    }
}

const getDefault = async (ctx, next) => {
    const user = Number(ctx.params.user);

    const query = {
        is_def: true,
        user_id: user
    }

    try {
        const ret = await mysql("address").where(query).select();

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
    }
}

const getAll = async (ctx, next) => {
    const page = Number(ctx.request.query.page) || 1;
    const limit = Number(ctx.request.query.limit) || 10;

    const user = Number(ctx.params.user);
    const query = {
        user_id: user
    }

    const offset = (page - 1) * limit;
    const order = ["create_at", "desc"];

    try {
        const  records = await mysql("address").count("user_id as records");
        const ret = await mysql("address").where(query).select().limit(limit).offset(offset).orderBy(...order);
 
        ctx.state.code = 200;
        ctx.state.message = "调用成功";

        const hasNext = (records[0].records - offset) <= limit ? false : true;
        ctx.state.data = {
            items: ret,
            paginate: {
                page: page,
                limit: limit,
                hasNext: hasNext
            }
        }
    } catch (err) {
        console.log(err)
    }
}

const get = async (ctx, next) => {
    const id = Number(ctx.params.id);
    const user_id = Number(ctx.params.user)
    const query = {
        _id: id,
        user_id: user_id
    }

    try {
        const ret = await mysql("address").where(query);
        if(!ret[0]) {
            ctx.state.code = 400;
            ctx.state.message = "资源不存在";
            ctx.state.data = null;
        } else {
            ctx.state.code = 200;
            ctx.state.message = "调用成功";
            ctx.state.data = ret[0]
        }
    } catch (err) {
        console.log(err)
    }

}

const post = async (ctx, next) => {

}

const put = async (ctx, next) => {

}

const del = async (ctx, next) => {

}

module.exports = {
    setDefault,
    getDefault,
    getAll,
    get,
    post,
    put,
    del
}