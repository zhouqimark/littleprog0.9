const { mysql } = require("../qcloud");

const createTable = () => {
    mysql.schema.hasTable("order").then(exists => {
        if(!exists) {
            return mysql.schema.createTable("order", t => {
                t.increments("_id").primary();
                t.integer("totalAmount");
                t.integer("payAmount");
                t.date("payTime");
                t.string("recipientName", 50);
                t.string("recipientGender", 50);
                t.string("recipientTel", 50);
                t.specificType("items", "JSON");
                t.integer("user_id").references("user._id");
                t.date("create_at");
                t.date("update_at");
            })
        }
    })
    
}

const order = async (ctx, next) => {
    createTable();
    const t = mysql.fn.now();
    const ex = await mysql.schema.hasTable("order");
    if(!ex){
        await mysql("order").insert({recipientName: "fasdf"});
    }
    await next();
}

module.exports = order;