const express = require("express");
const router = express.Router();

const Card = require("../models/Card");
const User = require("../models/User");

// CREATE
router.post("/:userId", async (req, res) => {
  try {
    const { id, name, position, number, userId } = req.body;
    if (!id || !name || !position || !number) {
      return res.status(400).json({ msg: "Please include all fields" });
    }

    const newCard = await Card.create({ id, name, position, number });
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.Cards.push(newCard._id);
    await user.save();

    res.status(201).json(newCard);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// READ ALL
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("Cards");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user.Cards);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// UPDATE
router.put("/:userId/cards/:cardId", async (req, res) => {
  try {
    const { id, name, position, number } = req.body;
    if (!id || !name || !position || !number) {
      return res.status(400).json({ msg: "Please include all fields" });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const card = user.Cards.find((card) => card_id === req.params.cardId);
    if (!card) {
      return res.status(404).json({ msg: "Card not found" });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { id, name, position, number },
      { new: true }
    );
    if (!updatedCard) {
      return res.status(404).json({ msg: "Card not found" });
    }

    res.status(200).json(updatedCard);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE
router.delete("/:userId/cards/:cardId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const deleteCard = user.Cards.find(
      (card) => card._id !== req.params.cardId
    );

    if (!deleteCard) {
      return res.status(404).json({ msg: "Card not found" });
    }

    user.Cards.remove(deleteCard._id);

    await user.save();

    res.status(200).json(deleteCard);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
