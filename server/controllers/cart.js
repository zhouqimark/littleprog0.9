const { mysql } = require("../qcloud");

const getAll = async (ctx, next) => {
    const user = Number(ctx.params.user);

   try {

        const ret = await mysql.raw( `select cart._id as _id, cart.goods as goods, cart.total as total,
                                        cart.amount as amount, cart.totalAmount as totalAmount, cart.user as user,
                                        goods._id as goods_id, goods.name as goods_name, goods.remark as goods_remark, goods.price as goods_price, goods.images as goods_images,
                                        cart.create_at as create_at, cart.update_at as update_at
                                        from cart join goods on cart.goods = goods._id
                                        where cart.user = ?
                                        order by cart.create_at desc`, user);
       const cartByUser = ret[0];
       const pretty_feed = [];

       cartByUser.forEach(item => 
            pretty_feed.push({
                _id: item._id,
                goods: {
                    goods_id: item.goods_id,
                    name: item.goods_name,
                    remark: item.goods_remark,
                    price: item.goods_price,
                    images: item.goods_images
                },
                total: item.total,
                amount: item.amount,
                totalAmount: item.totalAmount,
                user: item.user,
                create_at: item.create_at,
                upadte_at: item.upadte_at
            })
       )

       ctx.state.code = 200;
       ctx.state.message = "调用成功";

       ctx.state.data = pretty_feed;

   } catch (err) {
       console.log(err);
   }
}

const get = async (ctx, next) => {
    const _id = ctx.params.id;
    const user = ctx.params.user;
    const query = [_id, user];

    try {
        const ret = await mysql.raw( `select cart._id as _id, cart.goods as goods, cart.total as total,
                                        cart.amount as amount, cart.totalAmount as totalAmount, cart.user as user,
                                        goods._id as goods_id, goods.name as goods_name, goods.remark as goods_remark, goods.price as goods_price, goods.images as goods_images,
                                        cart.create_at as create_at, cart.update_at as update_at
                                        from cart join goods on cart.goods = goods._id
                                        where cart.user = ?
                                        order by cart.create_at desc`, query);
        const feedValue = ret[0];
        if(!feedValue[0]) {
            ctx.state.code = 200;
            ctx.state.code = "调用成功";
            ctx.state.data = feedValue;
        } else {
            ctx.state.code = 400;
            ctx.state.message = "资源不存在或已删除";
            ctx.state.data = null;
        }
    } catch (err) {
        console.log(err);
    }
}

const post = async (ctx, next) => {
    const goods = Number(ctx.request.body.goods);
    const user = Number(ctx.request.body.user);
    const total = Number(ctx.request.total);
    const query = {
        goods: goods,
        user: user
    }

    const body = {
        goods: goods,
        total: total || 1,
        user: user
    }

    try {
        const ret1 = await mysql("goods").where({_id: query.goods}).select();
        const goods = ret1[0];

        if(goods) {
            const ret2 = await mysql("cart").where(query).select();
            const cart = ret2[0];

            body.create_at = mysql.fn.now();
            if(!cart) {
                body.amount = goods.price;
                body.totalAmount = goods.price * body.total;
                await mysql("cart").insert(body);
            } else {
                //商品存在于购物车，增加数量，总价格
                cart.total = cart.total + body.total;//数量
                cart.amount = goods.price;//价格
                cart.totalAmount = goods.price * cart.total;
                await mysql("cart").where(query).update(cart);
            }
    
            ctx.state.code = 200;
            ctx.state.message = "新增成功";
            ctx.state.data = {
                _id: body.goods
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

const put = async (ctx, next) => {
    const id = Number(ctx.params.id);//goods_id
    const user = Number(ctx.params.user);//user_id
    const query = {
        _id: id,
        user: user
    }
    
    const total = Number(ctx.request.body.total);
    const body = {
        total: total
    }

   

    try {
        const ret = await mysql("cart").where(query).select();

        if(!ret[0]) {
            ctx.state.code = 400;
            ctx.state.message = "资源不存在或已删除";
            ctx.state.data = null;
        } else {
            body.total = Math.abs(body.total);
            body.totalAmount = Math.abs(ret[0].amount * total);
            body.update_at = mysql.fn.now();
            const feedValue = await mysql("cart").where(query).update(body);

            ctx.state.code = 200;
            ctx.state.message = "更新成功";
            ctx.state.data = feedValue;
        }
    } catch (err) {
        console.log(err);
    }
}

const del = async (ctx, next) => {
    const id = Number(ctx.params.id);
    const user = Number(ctx.params.user);
    const query = {
        _id: id,
        user: user
    }

    try {
        const ret = await mysql("cart").where(query).del();
        if(ret === undefined) {
            ctx.state.code = 400;
            ctx.state.message = "资源不存在或已删除";
            ctx.state.data = null;
        } else {
            ctx.state.code = 200;
            ctx.state.message = "删除成功";
            ctx.state.data = ret;
        }
    } catch (err) {
        console.log(err);
    }

}

const clear = async (ctx, next) => {
    const user = Number(ctx.params.user);
    const query = {
        user: user
    }

    try {
        const ret = await mysql("cart").where(query).del();
        
        ctx.state.code = 200;
        ctx.state.message = "删除成功";
        ctx.state.data = ret;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getAll,
    get,
    post,
    put,
    del,
    clear,
}