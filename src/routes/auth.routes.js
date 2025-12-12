import { Router } from "express";
import { login } from "../controllers/auth/login.controller.js";
import { registerUser } from "../controllers/auth/register.controller.js";
import jwt from "jsonwebtoken";
const router = Router();

router.post("/login", async (req, res) => {
    try {
        const { nume_complet , parola_hash } = req.body;

        if (!nume_complet || !parola_hash) {
            return res.status(400).json({
                success: false,
                message: "Utilizator si parola obligatorii"
            });
        }

        // login() must return user or null
        const result = await login(nume_complet, parola_hash);

        if (!result ) {
            return res.status(401).json({
                success: false,
                message: "Utilizatori sau parola incorecte"
            });
        }

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000
        });

        return res.json({
            success: true,
            message: "Login successful",
            result: result.utilizator
        });

    } catch (error) {
        console.error("Login error details:", error);
        return res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
});

router.post("/register", async (req, res) => {
    try {
	const { email, nume_complet, parola_hash } = req.body;
        const result = await registerUser(email, nume_complet, parola_hash);
        if(result.success === false) {
            return res.status(400).json({ message: result.message });
        }
        // logic to register user

        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
});

export default router;
