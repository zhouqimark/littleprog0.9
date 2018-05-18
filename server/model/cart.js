const { mysql } = require("../qcloud");

const createTable = () => {
    mysql.schema.hasTable("cart").then(exists => {
        if(!exists) {
            return mysql.schema.createTable("cart", t => {
                t.increments("_id").primary();
                t.integer("goods").references("goods._id").primary();
                t.integer("total").defaultTo(1);
                t.float("amount");
                t.float("totalAmount");
                t.integer("user").references("user._id").primary();
                t.date("create_at");
                t.date("update_at");
            })
        }
    })
}

const cart = async (ctx, next) => {
    createTable();
    const ex = await mysql.schema.hasTable("cart");
    if(ex) {
        const t = mysql.fn.now();
        await mysql("cart").insert([{goods: 1, total: 23, user: 3, create_at: t}, {goods: 1, totalAmount: 32, user: 2, create_at: t}])
    }

    await next();
}

module.exports = cart;
