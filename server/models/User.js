const db = require("../tools/db");

module.exports = db.defineModel("users", {
    id_card: {
        type: db.STRING(50),
        unique: true
    },

    name: db.STRING(50),
    date: db.DATE,
    w_age: db.INTEGER,
    tel_number: db.STRING(50),
    co_minor_type: db.STRING(50),
    co_main_type: db.STRING(50)
})