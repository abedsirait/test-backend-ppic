import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

export const User = db.define("users", {
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    refresh_token: {
        type: DataTypes.TEXT
    },
    role: {
        type: DataTypes.ENUM('admin', 'intake', 'production')
    }
},{
    freezeTableName: true
});

export const Productionresults = db.define("production_results", {
    kategori: DataTypes.STRING,
    mesin: DataTypes.STRING,
    jenisproduk: DataTypes.STRING,
    namaproduk: DataTypes.STRING,
    labelumum: DataTypes.STRING,
    supervisor: DataTypes.STRING,
    operator1: DataTypes.STRING,
    operator2: DataTypes.STRING,
    operator3: DataTypes.STRING,
    tanggal: DataTypes.DATE,
    tonase: DataTypes.INTEGER,
    totaljam: DataTypes.DECIMAL,
    keterangan: DataTypes.STRING,
    penyebabKarantina: DataTypes.STRING, 
    keteranganKarantina: DataTypes.STRING 

},{
    freezeTableName: true
});

export const Intakeresults = db.define("intake_results", {
    kodematerial: DataTypes.STRING,
    nama: DataTypes.STRING,
    tanggal: DataTypes.DATE,
    shift: DataTypes.STRING,
    operator: DataTypes.STRING,
    berat: DataTypes.INTEGER,
},{
    freezeTableName: true
});

export const Detaillabel = db.define("detaillabel", {
    detaillabel1 : DataTypes.STRING,
    detaillabel2 : DataTypes.STRING,
    detaillabel3 : DataTypes.STRING,
    operator : DataTypes.STRING,
    jam : DataTypes.TIME,
    tonase_label1 : DataTypes.INTEGER,
    tonase_label2 : DataTypes.INTEGER,
    tonase_label3 : DataTypes.INTEGER,
    karung1 : DataTypes.INTEGER,
    karung2: DataTypes.INTEGER,
    karung3: DataTypes.INTEGER,
    shift: DataTypes.STRING,
    productionResultId: {  // Foreign key
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Productionresults,  // Menghubungkan ke tabel Productionresults
            key: "id"
        },
        onDelete: "CASCADE"
    }
},{
    freezeTableName : true
})

// Definisi Relasi
Productionresults.hasMany(Detaillabel, { foreignKey: "productionResultId", as: "details" });
Detaillabel.belongsTo(Productionresults, { foreignKey: "productionResultId", as: "production" });

export const EditRequests = db.define("editrequests", {
    intakeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("pending", "resolved"),
        defaultValue: "pending"
    }
}, {
    freezeTableName: true
});

export const EditRequestProduction = db.define("editrequestsproduction", {
    productionId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("pending", "resolved"),
        defaultValue: "pending"
    }
}, {
    freezeTableName: true
});


