 const { mysql } = require("../qcloud");

 const models = require("../model/index");
 
 const getAll = async (ctx, next) => {
    const page = Number(ctx.request.query.page) || 1;
    const limit = Number(ctx.request.query.limit) || 10;
    const query = {};
    if(ctx.request.query.type) {
        query.types = ctx.request.query.type;
    }
    if(ctx.request.query.keyword) {
        query.keyword = ctx.request.query.keyword;
    }

    const offset = (page - 1) * limit;
    const order = ["create_at", "desc"];


    try {
        
        const  records = await mysql("goods").count("_id as records");
        const ret = await mysql("goods").where(query).select().limit(limit).offset(offset).orderBy(...order);

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
        console.log(err);
    }

 }

 const get = async (ctx, next) => {
     const query = {
         _id: ctx.params.id
     }

     try {
         const ret = await mysql("goods").innerJoin("classify", "goods.types", "classify._id").where(query).select();
         if(!ret) {
             ctx.state.code = 400;
             ctx.state.message = "资源不存在或已删除";
             ctx.state.data = {};
         }

         ctx.state.code = 200;
         ctx.state.message = "调用成功";
         ctx.state.data = ret[0];
     } catch (err) {
         console.log(err);
     }
 }

 const post = async (ctx, next) => {
    const body = {
        name: ctx.request.body.name,
        price: ctx.request.body.price,
        remark: ctx.request.body.remark,
        images: ctx.request.body,
        types: ctx.request.types
    }

    try {
        const ret = await mysql("goods").returning("_id").insert(body);
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
        price: ctx.request.body.price,
        remark: ctx.request.body.remark,
        images: ctx.request.body,
        types: ctx.request.types
    }

    try {
        const ret = await mysql("goods").returning(["_id", "name", "price", "remark", "images", "types"]).where(query).update(body);
        if(!ret) {
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
         const ret = await mysql("goods").where(query).del();
         if(!ret) {
             ctx.state.code = 400;
             ctx.state.message = "资源不存在或已删除";
             ctx.state.data = {};
         }
         ctx.state.code = 200;
         ctx.state.message = "删除成功";
         ctx.state.data = null;
     } catch (err) {
         console.log(err);
     }
 }

 const search = async (ctx, next) => {
     const keyword = ctx.request.query.keyword;

     try{
         //const clause =  `select goods._id, temp.num from goods join (select name, count(*) as num from goods group by name HAVING name like "%??%") as tempon goods.name = temp.name`;
         const kw = "%"+keyword+"%";
         const ret = await mysql.raw(`select goods._id, goods.name, temp.num  from goods right join (select name, count(*) as num from goods group by name having name like ?) as temp on goods.name = temp.name`, kw);

         
         ctx.state.code = 200;
         ctx.state.message = "调用成功";
         ctx.state.data = ret[0];

     } catch (err) {

         ctx.state.code = 400;
         console.log(err);
     }
 }
 module.exports = {
     getAll,
     get,
     post,
     put,
     del,
     search,
 }