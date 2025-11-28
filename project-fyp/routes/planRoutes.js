import express from "express";
import Destination from "../models/Destination.js";

const router = express.Router();

// GET travel plan by region, country, and budget
router.get("/", async (req, res) => {
  try {
    const { region, country, budget } = req.query;
    if (!region || !country || !budget)
      return res.status(400).json({ message: "Missing parameters" });

    const budgetNum = Number(budget);

    // Find a destination matching criteria
    const destination = await Destination.findOne({
      region,
      country,
      minBudget: { $lte: budgetNum },
      maxBudget: { $gte: budgetNum },
    });

    if (!destination) {
      return res
        .status(404)
        .json({ message: "No travel plan found for this budget range." });
    }

    return res.json(destination);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
