import Rating from "../models/ratings.js";

const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find();
    res.status(200).json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createRating = async (req, res) => {
  try {
    const rating = new Rating(req.body);
    await rating.save();
    res.status(201).json(rating);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteRating = async (req, res) => {
  try {
    await Rating.findByIdAndDelete(req.params.ratingId);
    res.status(204).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  getAllRatings,
  createRating,
  deleteRating
};