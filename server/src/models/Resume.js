const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
      unique: true,
    },
    personalInfo: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      portfolio: String,
    },
    education: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startYear: String,
        endYear: String,
        cgpa: String,
      },
    ],
    skills: {
      type: [String],
      default: [],
    },
    projects: [
      {
        title: String,
        description: String,
        technologies: [String],
        projectLink: String,
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        year: String,
      },
    ],
    experience: [
      {
        role: String,
        organization: String,
        duration: String,
        description: String,
      },
    ],
    templateName: {
      type: String,
      default: "classic",
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
