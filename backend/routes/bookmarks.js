const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');

// CREATE - Add a new bookmark
router.post('/', async (req, res) => {
  try {
    const { title, url, category, description, isFavorite } = req.body;
    const bookmark = new Bookmark({ title, url, category, description, isFavorite });
    const saved = await bookmark.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ - Get all bookmarks (optionally filter by category or search term)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { url: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ - Get a single bookmark by ID
router.get('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });
    res.json(bookmark);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - Edit an existing bookmark
router.put('/:id', async (req, res) => {
  try {
    const updated = await Bookmark.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Bookmark not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Remove a bookmark
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Bookmark.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Bookmark not found' });
    res.json({ message: 'Bookmark deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
