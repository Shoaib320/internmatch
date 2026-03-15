const StudentProfile = require("../models/StudentProfile");

function canAccessStudentResource(req) {
  return req.user.role === "admin" || req.user._id.toString() === req.params.userId;
}

async function createStudentProfile(req, res) {
  try {
    if (!["student", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only students or admins can create student profiles.",
      });
    }

    const targetUserId = req.user.role === "admin" && req.body.userId ? req.body.userId : req.user._id;
    const existingProfile = await StudentProfile.findOne({ userId: targetUserId });

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "Student profile already exists for this user.",
      });
    }

    const profile = await StudentProfile.create({
      ...req.body,
      userId: targetUserId,
      fullName:
        req.body.fullName || (targetUserId.toString() === req.user._id.toString() ? req.user.name : undefined),
    });

    return res.status(201).json({
      success: true,
      message: "Student profile created successfully.",
      profile,
    });
  } catch (error) {
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    return res.status(statusCode).json({
      success: false,
      message:
        error.name === "ValidationError"
          ? "Please check the required profile fields."
          : "Failed to create student profile.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function getStudentProfile(req, res) {
  try {
    if (!canAccessStudentResource(req)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this student profile.",
      });
    }

    const profile = await StudentProfile.findOne({ userId: req.params.userId }).populate(
      "userId",
      "name email role createdAt"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student profile.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function updateStudentProfile(req, res) {
  try {
    if (!canAccessStudentResource(req)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this student profile.",
      });
    }

    const updates = { ...req.body };
    delete updates.userId;

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student profile updated successfully.",
      profile,
    });
  } catch (error) {
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    return res.status(statusCode).json({
      success: false,
      message:
        error.name === "ValidationError"
          ? "Please check the required profile fields."
          : "Failed to update student profile.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function getStudentDashboard(req, res) {
  try {
    if (!canAccessStudentResource(req)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this dashboard.",
      });
    }

    const profile = await StudentProfile.findOne({ userId: req.params.userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      dashboard: {
        fullName: profile.fullName,
        profileCompletion: calculateStudentProfileCompletion(profile),
        skillsCount: profile.skills.length,
        projectsCount: profile.projects.length,
        certificationsCount: profile.certifications.length,
        preferredRole: profile.preferredRole || "",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student dashboard.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

function calculateStudentProfileCompletion(profile) {
  const fields = [
    profile.fullName,
    profile.phone,
    profile.collegeName,
    profile.location,
    profile.degree,
    profile.branch,
    profile.year,
    profile.semester,
    profile.cgpa,
    profile.skills.length,
    profile.projects.length,
    profile.preferredRole,
    profile.preferredLocation,
    profile.internshipType,
  ];

  const completedFields = fields.filter(Boolean).length;
  return Math.round((completedFields / fields.length) * 100);
}

module.exports = {
  createStudentProfile,
  getStudentDashboard,
  getStudentProfile,
  updateStudentProfile,
};
