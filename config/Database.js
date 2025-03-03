import { Sequelize } from "sequelize";

const db = new Sequelize("stpcontrol", "root","1918171615",{
    host: "34.50.64.242",
    dialect: "mysql",
})

export default db