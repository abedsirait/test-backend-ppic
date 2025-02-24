import { User } from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);

        // Cari user berdasarkan refresh token
        const users = await User.findAll({
            where: {
                refresh_token: refreshToken
            }
        });

        if (users.length === 0) return res.sendStatus(403); // Jika user tidak ditemukan

        const user = users[0]; // Ambil user pertama dari array

        // Verifikasi refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.error(err); // Cetak error agar bisa di-debug
                return res.sendStatus(403);
            }

            // Buat access token baru
            const accessToken = jwt.sign(
                { userId: user.id, username: user.username, role: user.role },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15s" }
            );

            res.json({ accessToken });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};
