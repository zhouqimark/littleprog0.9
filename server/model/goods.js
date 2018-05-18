const { mysql } = require("../qcloud");

const createTable = () => { mysql.schema.hasTable("goods").then(exists => {
    if(!exists) {
        return mysql.schema.createTable("goods", t => {
            t.increments("_id").primary();
            t.string("name", 50);
            t.integer("types").unsigned();
            t.foreign("types").references("classify._id");
            t.float("price");
            t.text("remark");
            t.specificType("images", "JSON").notNullable();
            t.date("create_at");
            t.date("update_at");
        })
    }
})}

const goods = async (ctx, next) => {
    createTable();
    const t = mysql.fn.now();
    const images = ['https://wximg-1256514917.cos.ap-guangzhou.myqcloud.com/b.jpg', 'https://wximg-1256514917.cos.ap-guangzhou.myqcloud.com/b.jpg'];
    var injecteData = []
    for(let i = 0; i < 19; i++) {
        const d = {name: "test", types: 1, price: 99.1, images: JSON.stringify(images), create_at: t}
        injecteData.push(d);
    }
    await mysql("goods").insert(injecteData);
    await next();

}

module.exports = goods;