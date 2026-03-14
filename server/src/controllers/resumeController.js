const Resume = require("../models/Resume");
const StudentProfile = require("../models/StudentProfile");

async function createResume(req, res) {
  try {
    if (!["student", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only students or admins can create resumes.",
      });
    }

    const targetStudentId =
      req.user.role === "admin" && req.body.studentId
        ? req.body.studentId
        : (await StudentProfile.findOne({ userId: req.user._id }))?._id;

    if (!targetStudentId) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found. Create student profile first.",
      });
    }

    const existingResume = await Resume.findOne({ studentId: targetStudentId });

    if (existingResume) {
      return res.status(409).json({
        success: false,
        message: "Resume already exists for this student.",
      });
    }

    const resume = await Resume.create({
      ...req.body,
      studentId: targetStudentId,
    });

    return res.status(201).json({
      success: true,
      message: "Resume created successfully.",
      resume,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create resume.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function getResume(req, res) {
  try {
    const studentProfile = await StudentProfile.findById(req.params.studentId);

    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    if (
      req.user.role !== "admin" &&
      !(req.user.role === "student" && studentProfile.userId.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this resume.",
      });
    }

    const resume = await Resume.findOne({ studentId: req.params.studentId });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    return res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function updateResume(req, res) {
  try {
    const studentProfile = await StudentProfile.findById(req.params.studentId);

    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    if (
      req.user.role !== "admin" &&
      !(req.user.role === "student" && studentProfile.userId.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this resume.",
      });
    }

    const updates = { ...req.body };
    delete updates.studentId;

    const resume = await Resume.findOneAndUpdate(
      { studentId: req.params.studentId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume updated successfully.",
      resume,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update resume.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

module.exports = {
  createResume,
  getResume,
  updateResume,
};
