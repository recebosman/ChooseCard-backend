const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
    number: { type: String, required: true },
  },
  { timestamps: true }
);

const Card = mongoose.model("Card", CardSchema);

module.exports = Card;
