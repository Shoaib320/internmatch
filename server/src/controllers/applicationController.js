const Application = require("../models/Application");
const Company = require("../models/Company");
const Internship = require("../models/Internship");
const StudentProfile = require("../models/StudentProfile");

async function createApplication(req, res) {
  try {
    if (!["student", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only students or admins can apply to internships.",
      });
    }

    const { internshipId, studentId } = req.body;

    if (!internshipId) {
      return res.status(400).json({
        success: false,
        message: "internshipId is required.",
      });
    }

    const internship = await Internship.findById(internshipId);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found.",
      });
    }

    const studentProfile =
      req.user.role === "admin" && studentId
        ? await StudentProfile.findById(studentId)
        : await StudentProfile.findOne({ userId: req.user._id });

    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found. Create student profile first.",
      });
    }

    const existingApplication = await Application.findOne({
      studentId: studentProfile._id,
      internshipId,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied to this internship.",
      });
    }

    const application = await Application.create({
      studentId: studentProfile._id,
      internshipId: internship._id,
      companyId: internship.companyId,
      status: "applied",
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create application.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function getStudentApplications(req, res) {
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
        message: "You do not have permission to view these applications.",
      });
    }

    const applications = await Application.find({ studentId: req.params.studentId })
      .populate("internshipId")
      .populate("companyId", "companyName email");

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student applications.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function getCompanyApplications(req, res) {
  try {
    const company = await Company.findById(req.params.companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    if (
      req.user.role !== "admin" &&
      !(req.user.role === "company" && company.userId.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view these applications.",
      });
    }

    const applications = await Application.find({ companyId: req.params.companyId })
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email role",
        },
      })
      .populate("internshipId");

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch company applications.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function updateApplicationStatus(req, res) {
  try {
    const { status } = req.body;
    const allowedStatuses = ["applied", "shortlisted", "rejected", "selected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status.",
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (req.user.role !== "admin") {
      const company = await Company.findOne({ userId: req.user._id });

      if (!company || company._id.toString() !== application.companyId.toString()) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to update this application.",
        });
      }
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully.",
      application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update application status.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

module.exports = {
  createApplication,
  getCompanyApplications,
  getStudentApplications,
  updateApplicationStatus,
};
