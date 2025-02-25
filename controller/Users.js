import { User } from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Cari user berdasarkan username
        const user = await User.findOne({ where: { username } });

        // Jika user tidak ditemukan
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Cek password dengan bcrypt
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ msg: "Wrong Password" });

        // Generate Access Token & Refresh Token
        const accessToken = jwt.sign(
            { id: user.id, role: user.role },  // Tambahkan role ke token
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "20s" }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN_SECRET,  // Pakai REFRESH_TOKEN_SECRET
            { expiresIn: "1d" }
        );

        // Simpan refresh token di database
        await User.update({ refresh_token: refreshToken }, { where: { id: user.id } });

        // Set refresh token di cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure : true,
            sameSite : "None",
            maxAge: 24 * 60 * 60 * 1000,
        });

        // Kirim response ke frontend
        res.json({ msg: "Login success", role: user.role, accessToken });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error", error: error.message });
    }
};


export const getUser = async (req, res) => {
    try {
        const user = await User.findAll({
            attributes : ['username', 'role']
        });
        res.json(user);
    } catch (error) {
        console.log(error);
    }
}


export const Logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(204); // No Content

        // Cari user berdasarkan refresh token
        const users = await User.findAll({
            where: { refresh_token: refreshToken }
        });

        if (users.length === 0) return res.sendStatus(204); // Tidak ada user dengan refresh token tersebut

        const userId = users[0].id;

        // Update refresh_token menjadi null di database
        await User.update({ refresh_token: null }, {
            where: { id: userId }
        });

        // Hapus cookie refreshToken
        res.clearCookie('refreshToken');

        return res.sendStatus(200); // OK

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};

export const Register = async(req, res) => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    try {
        const user = await User.create({
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role
        })
        res.json(user);
    } catch (error) {
        console.log(error);
    }
}