import { Sequelize } from "sequelize";

const db = new Sequelize("railway", "root","IYFnGiOmRYmAQdvZMEFgnxQEfSPzEoDJ",{
    host: "switchback.proxy.rlwy.net",
    port: 23159,
    dialect: "mysql",
})

export default db