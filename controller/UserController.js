import {Productionresults, Intakeresults, Detaillabel, EditRequests, EditRequestProduction} from "../models/UserModel.js";
import XLSX from 'xlsx';

export const getallProductionresults = async (req, res) => {
    try {
        const response = await Productionresults.findAll({
            include: [{model: Detaillabel,
                as: "details"
            }]
        });
        
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getProductionbyId = async (req, res) => {
    try {
        const response = await Productionresults.findOne({
            where: {
                id: req.params.id
            },
            include: [{model: Detaillabel,
                as: "details"
            }]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const uploadProductionresults = async (req, res) => {
    try {
        const { 
            kategori, penyebabKarantina, keteranganKarantina, mesin, jenisproduk, namaproduk, labelumum, supervisor, operator1,operator2, operator3, shift, tanggal, tonase,totaljam, keterangan, details 
        } = req.body;

        const penyebabKarantinaFinal = kategori === "Karantina" ? penyebabKarantina : null;
        const keteranganKarantinaFinal = kategori === "Karantina" ? keteranganKarantina : null;

        // Membuat entri production_results
        const productionResult = await Productionresults.create({
            kategori,
            penyebabKarantina : penyebabKarantinaFinal,
            keteranganKarantina : keteranganKarantinaFinal,
            mesin,
            jenisproduk,
            namaproduk,
            labelumum,
            supervisor,
            operator1,
            operator2,
            operator3,
            shift,
            tanggal,
            tonase,
            totaljam,
            keterangan,
            details
        });

        // Membuat entri detaillabel terkait
        for (const detail of details) {
            await Detaillabel.create({
                detaillabel1: detail.detaillabel1,
                karung1: detail.karung1,
                tonase_label1: detail.tonase_label1,
                detaillabel2: detail.detaillabel2,
                karung2: detail.karung2,
                tonase_label2: detail.tonase_label2,
                detaillabel3: detail.detaillabel3,
                karung3: detail.karung3,
                tonase_label3: detail.tonase_label3,
                operator: detail.operator,
                jam: detail.jam,
                productionResultId: productionResult.id // Foreign key ke production_results
            });
        }
        res.status(201).json({ msg: "Data berhasil ditambahkan" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const updateProductionresults = async (req, res) => {
    try {
        // Update data utama di tabel Productionresults
        const production = await Productionresults.findByPk(req.params.id);
        if (!production) {
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }

        await production.update(req.body);

        // Debugging: Cek apakah details diterima di backend
        console.log("Received details:", req.body.details);

        // Jika ada data details, update atau insert satu per satu
        if (req.body.details && req.body.details.length > 0) {
            for (let detail of req.body.details) {
                if (detail.id) { 
                    // Jika detail memiliki ID, update data yang sudah ada
                    await Detaillabel.update(detail, { where: { id: detail.id } });
                } else {
                    // Jika tidak memiliki ID, buat data baru
                    await Detaillabel.create({
                        ...detail,
                        productionResultId: production.id, // Sesuaikan dengan relasi database
                    });
                }
            }
        }

        res.status(200).json({ msg: "Data berhasil diupdate" });
    } catch (error) {
        console.error("Error updating production results:", error);
        res.status(500).json({ msg: error.message });
    }
};



export const deleteProductionresults = async (req, res) => {
    try {
        await Productionresults.destroy({
            where: {
                id: req.params.id
            },
            include: [{model: Detaillabel,
                as: "details"
            }]
        });
        res.status(200).json({ msg: "Data berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}



export const getallIntakeresults = async (req, res) => {
    try {
        const response = await Intakeresults.findAll();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getIntakebyId = async (req, res) => {
    try {
        const response = await Intakeresults.findOne({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const uploadIntakeresults = async (req, res) => {
    try {
       await Intakeresults.create(req.body);
        res.status(201).json({ msg: "Data berhasil ditambahkan" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const updateIntakeresults = async (req, res) => {
    try {
        await Intakeresults.update(req.body,{
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "Data berhasil diupdate" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const deleteIntakeresults = async (req, res) => {
    try {
        await Intakeresults.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "Data berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const exportIntakeresults = async (req, res) => {
    try {
        const response = await Intakeresults.findAll();

        const formatDateCreate = (isoDate) => {
            return new Intl.DateTimeFormat("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false, // Gunakan format 24 jam
              timeZone: "Asia/Jakarta" // Pastikan sesuai zona waktu Indonesia
            }).format(new Date(isoDate));
        };

        const jsonData = response.map((item) => ({
            "Material Code": item.kodematerial,
            "Material Name": item.nama,
            "Date": item.tanggal,
            "Shift" : item.shift,
            "Operator": item.operator,
            "Tonase": item.berat,
            "Created At": formatDateCreate(item.createdAt),
            "Updated At": formatDateCreate(item.updatedAt)
        }))
        const worksheet = XLSX.utils.json_to_sheet(jsonData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "IntakeData");

        // Buat file buffer
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="intake_data.xlsx"'
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.send(excelBuffer);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}



export const exportProductionresults = async (req, res) => {
    try {
        const response = await Productionresults.findAll({
            include: [{ model: Detaillabel, as: "details" }]
        });

        const formatDate = (isoDate) => {
            return new Intl.DateTimeFormat("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false, // Gunakan format 24 jam
              timeZone: "Asia/Jakarta" // Pastikan sesuai zona waktu Indonesia
            }).format(new Date(isoDate));
        };

        // Header utama dan sub-header
        const header = [
            ["Mesin", "Jenis Produk", "Nama Produk", "Kategori","Label", "Detail Label", "","","","","","","","","","","Tanggal", "Shift", "Supervisor", "Operator", "Tonase", "Keterangan", "CreateAt", "UpdateAt"],
            ["", "", "", "", "", "Detail Label1", "Karung Label 1","Tonase Label 1","Detail Label2", "Karung Label 2","Tonase Label 2", "Detail Label3", "Karung Label 3","Tonase Label 3", "Operator", "Jam","", "", "", "", "", "","",""]
        ];

        // Data untuk setiap produksi dan detail label
        let jsonData = [];
        let merges = [];

        let rowIndex = header.length; // Mulai setelah header

        


        response.forEach((item) => {
            const penyebabKarantinaData = [item.penyebabKarantina, item.keteranganKarantina, item.keterangan]
                .filter(value => value && value.trim() !== "")  // Hapus nilai kosong/null
                .join(", ") || ""; // Jika semua kosong, return string kosong
            const details = item.details;

            details.forEach((detail, index) => {
                jsonData.push([
                    
                    index === 0 ? item.mesin : "",
                    index === 0 ? item.jenisproduk : "",
                    index === 0 ? item.namaproduk : "",
                    index === 0 ? item.kategori : "", 
                    index === 0 ? item.labelumum : "",
                    detail.detaillabel1, detail.karung1, detail.tonase_label1,
                    detail.detaillabel2, detail.karung2, detail.tonase_label2,
                    detail.detaillabel3, detail.karung3, detail.tonase_label3,
                    detail.operator, detail.jam,
                    index === 0 ? item.tanggal : "",
                    index === 0 ? item.shift : "",
                    index === 0 ? item.supervisor : "",
                    index === 0 ? `${item.operator1}, ${item.operator2}, ${item.operator3}` : "",
                    index === 0 ? item.tonase : "",
                    penyebabKarantinaData,
                    index === 0 ? formatDate(item.createdAt) : "",
                    index === 0 ? formatDate(item.updatedAt) : ""
                ]);
            });

            // Merge cell untuk data utama agar hanya tampil sekali di baris pertama
            if (details.length > 1) {
                merges.push({ s: { r: rowIndex, c: 0     }, e: { r: rowIndex + details.length - 1, c: 0 } }); // Keterangan
                merges.push({ s: { r: rowIndex, c: 1 }, e: { r: rowIndex + details.length - 1, c: 1 } }); // Mesin
                merges.push({ s: { r: rowIndex, c: 2 }, e: { r: rowIndex + details.length - 1, c: 2 } }); // Jenis Produk
                merges.push({ s: { r: rowIndex, c: 3 }, e: { r: rowIndex + details.length - 1, c: 3 } }); // Nama Produk
                merges.push({ s: { r: rowIndex, c: 4 }, e: { r: rowIndex + details.length - 1, c: 4 } }); // Label
                merges.push({ s: { r: rowIndex, c: 16 }, e: { r: rowIndex + details.length - 1, c: 16 } }); // Tanggal
                merges.push({ s: { r: rowIndex, c: 17 }, e: { r: rowIndex + details.length - 1, c: 17 } }); // Shift
                merges.push({ s: { r: rowIndex, c: 18 }, e: { r: rowIndex + details.length - 1, c: 18 } }); // Supervisor
                merges.push({ s: { r: rowIndex, c: 19 }, e: { r: rowIndex + details.length - 1, c: 19 } }); // Operator
                merges.push({ s: { r: rowIndex, c: 20 }, e: { r: rowIndex + details.length - 1, c: 20 } }); // Tonase
                merges.push({ s: { r: rowIndex, c: 21 }, e: { r: rowIndex + details.length - 1, c: 21 } }); // Keterangan
                merges.push({ s: { r: rowIndex, c: 22 }, e: { r: rowIndex + details.length - 1, c: 22 } }); // CreateAt
                merges.push({ s: { r: rowIndex, c: 23 }, e: { r: rowIndex + details.length - 1, c: 23 } }); // UpdateAt
            }

            rowIndex += details.length;
        });

        // Gabungkan header dengan data
        const worksheet = XLSX.utils.aoa_to_sheet([...header, ...jsonData]);

        // Merge header untuk "Detail Label", "Jam", dan "Berat"
        merges.push(
            { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
            { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } },
            { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } },
            { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } },
            { s: { r: 0, c: 4 }, e: { r: 1, c: 4 } },
            { s: { r: 0, c: 5 }, e: { r: 0, c: 15 } }, // Merge "Detail Label"
            { s: { r: 0, c: 16 }, e: { r: 1, c: 16 } }, // Merge "Tanggal"
            { s: { r: 0, c: 17 }, e: { r: 1, c: 17 } }, // Merge "Shift"
            { s: { r: 0, c: 18 }, e: { r: 1, c: 18 } }, // Merge "Supervisor"
            { s: { r: 0, c: 19 }, e: { r: 1, c: 19 } }, // Merge "Operator"
            { s: { r: 0, c: 20 }, e: { r: 1, c: 20 } }, // Merge "Tonase"
            { s: { r: 0, c: 21 }, e: { r: 1, c: 21 } }, // Merge "Keterangan"
            { s: { r: 0, c: 22 }, e: { r: 1, c: 22 } }, // Merge "CreateAt"
            { s: { r: 0, c: 23 }, e: { r: 1, c: 23 } }  // Merge "UpdateAt"
        );

        worksheet["!cols"] = [
            { wch: 10 }, // Mesin
            { wch: 15 }, // Jenis Produk
            { wch: 20 }, // Nama Produk
            { wch: 15 }, // Kategori
            { wch: 15 }, // Label
            { wch: 15 }, { wch: 15 }, { wch: 15 }, // Detail Label1, Karung 1, Tonase 1
            { wch: 15 }, { wch: 15 }, { wch: 15 }, // Detail Label2, Karung 2, Tonase 2
            { wch: 15 }, { wch: 15 }, { wch: 15 }, // Detail Label3, Karung 3, Tonase 3
            { wch: 15 }, // Operator
            { wch: 10 }, // Jam
            { wch: 15 }, // Tanggal
            { wch: 10 }, // Shift
            { wch: 15 }, // Supervisor
            { wch: 20 }, // Operator
            { wch: 15 }, // Tonase
            { wch: 20 }, // Keterangan
            { wch: 20 }, // CreateAt
            { wch: 20 }  // UpdateAt
        ];
        

        worksheet["!merges"] = merges;

        // Buat workbook dan tambahkan sheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Production Data");

        // Buat file buffer
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

        res.setHeader("Content-Disposition", 'attachment; filename="production_data.xlsx"');
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        res.send(excelBuffer);
        console.log("Data Production berhasil diexport!");

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const requestEditIntake = async (req, res) => {
    try {
        const { intakeId, reason } = req.body;

        if (!intakeId || !reason) {
            return res.status(400).json({ msg: "ID dan alasan harus diisi!" });
        }

        await EditRequests.create({
            intakeId,
            reason,
            status: "pending"
        });

        res.status(201).json({ msg: "Request edit telah dikirim!" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getEditRequestsIntake = async (req, res) => {
    try {
        const requests = await EditRequests.findAll({
            where: { status: "pending" },
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const resolveEditRequestIntake = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await EditRequests.findByPk(id);

        if (!request) {
            return res.status(404).json({ msg: "Request tidak ditemukan!" });
        }

        await request.update({ status: "resolved" });

        res.status(200).json({ msg: "Request edit telah diselesaikan!" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const requestEditProduction = async (req, res) => {
    try {
        const { productionId, reason } = req.body;

        if (!productionId || !reason) {
            return res.status(400).json({ msg: "ID dan alasan harus diisi!" });
        }

        await EditRequestProduction.create({
            productionId,
            reason,
            status: "pending"
        });

        res.status(201).json({ msg: "Request edit telah dikirim!" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getEditRequestsProduction = async (req, res) => {
    try {
        const requests = await EditRequestProduction.findAll({
            where: { status: "pending" },
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const resolveEditRequestProduction = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await EditRequestProduction.findByPk(id);

        if (!request) {
            return res.status(404).json({ msg: "Request tidak ditemukan!" });
        }

        await request.update({ status: "resolved" });

        res.status(200).json({ msg: "Request edit telah diselesaikan!" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};