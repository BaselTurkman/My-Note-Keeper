const express = require("express");
const mongoose = require("mongoose");
const Note = require("../models/Note");
const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const notes = await Note.find()
        res.json(notes)
    } catch (error) {
        res.status(500).json({ message: "server error!", error: error.message })
    }
})

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
        res.status(500).json({ message: "server error!", error: error.message })
    }
})

router.put("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            console.log("test error");
            return res.status(400).json({ message: "Invalid note ID" });
        }

        const { title, content } = req.body;
        if (!title | !content) {
            return res.status(400).json({ message: "All Fields are Required" })
        }

        const updateNote = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true })
        res.status(200).json(updateNote)
    } catch (error) {
        res.status(500).json({ message: "server error!", error: error.message })
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
        res.status(500).json({ message: "server error!", error: error.message })
    }
})



module.exports = router