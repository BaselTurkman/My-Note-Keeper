const express = require("express");
const mongoose = require("mongoose");
const Note = require("../models/Note");
const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalNotes = await Note.countDocuments();

        if (page > Math.ceil(totalNotes / limit)) {
            return res.status(404).json({ success: false, message: "Page not found" });
        }
        const notes = await Note.find().skip(skip).limit(limit);

        if (notes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No notes found"
            });
        }

        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalNotes / limit),
            totalNotes,
            notes
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error!", error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "All Fields are Required" })
        }

        const newNode = new Note({ title, content })
        await newNode.save()
        res.status(201).json(newNode)
    } catch (error) {
        res.status(500).json({ message: "Server error!", error: error.message })
    }
})

router.put("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid note ID" });
        }

        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "All Fields are Required" })
        }

        const updateNote = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true })
        if (!updateNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json(updateNote)
    } catch (error) {
        res.status(500).json({ message: "Server error!", error: error.message })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid note ID" });
        }

        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({ message: "Note deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error!", error: error.message })
    }
})

router.get("/search", async (req, res) => {
    try {
        const { title, content } = req.query;

        if (!title && !content) {
            return res.status(400).json({ success: false, message: "Please provide a search query" });
        }

        const filter = [];

        if (title) filter.push({ title: { $regex: title, $options: "i" } });
        if (content) filter.push({ content: { $regex: content, $options: "i" } });

        const notes = await Note.find(filter.length ? { $or: filter } : {});

        if (notes.length === 0) {
            return res.status(404).json({ success: false, message: "No notes found for the given query" });
        }

        res.status(200).json({ success: true, data: notes });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});


module.exports = router