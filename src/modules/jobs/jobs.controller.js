import { JobsService } from "./jobs.service.js";

export const JobsController = {
  // Define controller methods here
    async getAll(req, res) {
        try {
            const jobs = await JobsService.get();
            res.status(200).json(jobs);
        } catch (err) {
            next(err);
        }
    },

    async getById(req, res) {   
        try {
        const data = await JobsService.getById(req.params.id);
        if (!data) {
            return res.status(404).json({ error: "Informatiile nu au fost gasite" });
        }
        res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    },

    async create(req, res, next) {
        try {
            const data = await JobsService.create(req.body);
            res.status(201).json({
                success: true,
                message: "Informatiile au fost salvate",
                data: data,
            });
        } catch (error) {
            next({
                status: 500,
                message: "A aparut o eroare la salvarea informatiilor",
                details: error.message
            });
        }
    },
    
    // ...existing code...
    async update(req, res) {
        try {
        const data = await JobsService.update(req.params.id, req.body);
        if (!data) {
            return res.status(404).json({ error: "Informatiile nu au fost gasite" });
        }
        res.status(200).json(data);
        } catch (error) {
        res.status(500).json({ error: "Eroare server" });
        }
    },

    async delete(req, res) {
        try {
            const data = await JobsService.getById(req.params.id);
            if (!data) {
                return res.status(404).json({ error: "Informatiile nu au fost gasite" });
            }
            await JobsService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: "Eroare server" });
        }
    }
};