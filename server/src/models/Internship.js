const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    internshipTitle: {
      type: String,
      required: true,
      trim: true,
    },
    internshipDescription: {
      type: String,
      required: true,
      trim: true,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    preferredDegree: {
      type: String,
      trim: true,
    },
    preferredBranch: {
      type: [String],
      default: [],
    },
    minimumCgpa: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    yearEligible: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      trim: true,
    },
    internshipType: {
      type: String,
      enum: ["remote", "onsite", "hybrid"],
      required: true,
    },
    stipend: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    domain: {
      type: String,
      trim: true,
    },
    openings: {
      type: Number,
      min: 1,
      default: 1,
    },
    applicationDeadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Internship = mongoose.model("Internship", internshipSchema);

module.exports = Internship;
