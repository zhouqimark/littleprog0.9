
const { mysql } = require("../qcloud");

const get =  async (ctx, next) => {
    
    //const classifications = await mysql("goods").select("id", "name").from("classification");
    const id = ctx.params.id;
    
    const query = Object.assign({}, (id !== undefined ? {id: id} : {}));
    
    try {
        const ret = await mysql("classify").returning(["_id", "name", "remark", "create_at", "update_at"]).select().where(where);
        if (!ret) {
            ctx.state.code = 400;
            ctx.state.message = "资源不存在或已删除"
            ctx.state.data = {}
        }

        ctx.state.code = 200;
        ctx.state.message = "调用成功";
        ctx.state.data = ret[0];
    } catch (err) {
        console.log(err);
    }
}

const getAll = async (ctx, next) => {
    const page = Number(ctx.request.query.page) || 1;
    const limit = Number(ctx.request.query.limit) || 10;
    const offset = (page - 1) * limit;
    const order = ["create_at", "desc"]

    try {
        const ret = await mysql("classify").returning(["_id", "name", "remark", "create_at", "update_at"]).select().limit(limit).offset(offset).orderBy(...order)
        
        ctx.state.code = 200;
        ctx.state.message = "调用成功";
        ctx.state.data = {
            items: ret
        }
    } catch (err) {
        console.log(err);
    }

} 

const post = async (ctx, next) => {
    const body = {
        name: ctx.request.body.name,
        remark: ctx.request.body.remark,
        update_at: mysql.fn.now()
    }

    try {
        const ret = await mysql("classify").returning("_id").insert(body);
        ctx.state.code = 200;
        ctx.state.message = "新增成功";
        ctx.state.data = {
            _id: ret[0]
        }
    } catch (err) {
        console.log(err);
    }
}

const put = async (ctx, next) => {
    const query = {
        _id: ctx.params.id
    }

    const body = {
        name: ctx.request.body.name,
        remark: ctx.request.body.remark,
        update_at: mysql.fn.now()
    }
    try{
        const ret = await mysql("classify").returning(["_id", "name", "remark", "create_at", "update_at"]).where(query).update(body);
        if(!ret){
            ctx.state.code = 400;
            ctx.state.message = "资源不存在或已删除";
            ctx.state.data = {};
        }
        ctx.state.code = 200;
        ctx.state.message = "更新成功";
        ctx.state.data = ret[0];
    } catch (err) {
        console.log(err);
    }
}

const del = async (ctx, next) => {
    const query = {
        _id: ctx.params.id
    }

    try {
        const ret = await mysql("classify").where(query).del();

        if(!ret) {
            ctx.state.code = 400;
            ctx.state.message = "资源不存在或已删除";
        }
        ctx.state.code = 200;
        ctx.state.message = "删除成功";
        ctx.state.data = null;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    get,
    getAll,
    post,
    put,
    del
}