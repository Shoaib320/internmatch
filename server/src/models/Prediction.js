const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },
    recommendations: [
      {
        internshipId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Internship",
          required: true,
        },
        internshipTitle: String,
        companyName: String,
        matchScore: Number,
        matchedSkills: [String],
        missingSkills: [String],
        location: String,
        internshipType: String,
      },
    ],
    predictedRoles: [
      {
        role: String,
        confidence: Number,
      },
    ],
    engine: {
      type: String,
      default: "rule-based-fallback",
    },
    fallbackReason: String,
  },
  {
    timestamps: true,
  }
);

const Prediction = mongoose.model("Prediction", predictionSchema);

module.exports = Prediction;
