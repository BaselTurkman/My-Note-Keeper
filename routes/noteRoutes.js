const express = require("express");
const Note = require("../models/Note");
const router = express.Router();


router.get("/", async (req, res) => {
    try{
        const notes = await Note.find()
        res.json(notes)
    }catch(error){
         res.status(500).json({ message: "server error!" + error })
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
         res.status(500).json({ message: "server error!" })
    }
})

router.put("/:id", async(req, res) => {
    try{
        const {title, content} = req.body;
        const updateNote = await Note.findByIdAndUpdate(req.params.id, {title, content}, {new: true})
        res.status(200).json(updateNote)
    }catch(error){
        res.status(500).json({ message: "server error!" })
    }
})

router.delete("/:id", async(req, res) => {
    try{
        await Note.findByIdAndDelete(req.params.id);
         res.status(200).json({message: "Note deleted successfully"})
    }catch(error){
         res.status(500).json({ message: "server error!" })
    }
})



module.exports = router