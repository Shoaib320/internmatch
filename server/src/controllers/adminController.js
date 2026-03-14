const Application = require("../models/Application");
const Company = require("../models/Company");
const Internship = require("../models/Internship");
const Prediction = require("../models/Prediction");
const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");

async function getAdminDashboard(req, res) {
  try {
    const [
      totalUsers,
      totalStudents,
      totalCompanies,
      totalInternships,
      totalApplications,
      totalPredictions,
    ] = await Promise.all([
      User.countDocuments(),
      StudentProfile.countDocuments(),
      Company.countDocuments(),
      Internship.countDocuments(),
      Application.countDocuments(),
      Prediction.countDocuments(),
    ]);

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("name email role createdAt");
    const recentInternships = await Internship.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("internshipTitle companyName internshipType createdAt");

    return res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalStudents,
        totalCompanies,
        totalInternships,
        totalApplications,
        totalPredictions,
        recentUsers,
        recentInternships,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select("-password");

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function getCompanies(req, res) {
  try {
    const companies = await Company.find()
      .populate("userId", "name email role createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch companies.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function getInternships(req, res) {
  try {
    const internships = await Internship.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: internships.length,
      internships,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch internships.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.role === "student") {
      const studentProfile = await StudentProfile.findOne({ userId: user._id });

      if (studentProfile) {
        await Promise.all([
          Application.deleteMany({ studentId: studentProfile._id }),
          Prediction.deleteMany({ studentId: studentProfile._id }),
        ]);
        await studentProfile.deleteOne();
      }
    }

    if (user.role === "company") {
      const company = await Company.findOne({ userId: user._id });

      if (company) {
        const internships = await Internship.find({ companyId: company._id }).select("_id");
        const internshipIds = internships.map((item) => item._id);

        await Promise.all([
          Application.deleteMany({ companyId: company._id }),
          internshipIds.length ? Application.deleteMany({ internshipId: { $in: internshipIds } }) : Promise.resolve(),
          Internship.deleteMany({ companyId: company._id }),
        ]);
        await company.deleteOne();
      }
    }

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function deleteCompany(req, res) {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    const internships = await Internship.find({ companyId: company._id }).select("_id");
    const internshipIds = internships.map((item) => item._id);

    await Promise.all([
      Application.deleteMany({ companyId: company._id }),
      internshipIds.length ? Application.deleteMany({ internshipId: { $in: internshipIds } }) : Promise.resolve(),
      Internship.deleteMany({ companyId: company._id }),
    ]);

    await company.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Company deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete company.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function deleteInternship(req, res) {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found.",
      });
    }

    await Promise.all([
      Application.deleteMany({ internshipId: internship._id }),
      internship.deleteOne(),
    ]);

    return res.status(200).json({
      success: true,
      message: "Internship deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete internship.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

module.exports = {
  deleteCompany,
  deleteInternship,
  deleteUser,
  getAdminDashboard,
  getCompanies,
  getInternships,
  getUsers,
};
