const Company = require("../models/Company");
const Internship = require("../models/Internship");

function canAccessCompanyResource(req) {
  return req.user.role === "admin" || req.user._id.toString() === req.params.userId;
}

async function createCompanyProfile(req, res) {
  try {
    if (!["company", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only companies or admins can create company profiles.",
      });
    }

    const targetUserId = req.user.role === "admin" && req.body.userId ? req.body.userId : req.user._id;
    const existingCompany = await Company.findOne({ userId: targetUserId });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: "Company profile already exists for this user.",
      });
    }

    const company = await Company.create({
      ...req.body,
      userId: targetUserId,
      email:
        req.body.email || (targetUserId.toString() === req.user._id.toString() ? req.user.email : undefined),
    });

    return res.status(201).json({
      success: true,
      message: "Company profile created successfully.",
      company,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create company profile.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function getCompanyProfile(req, res) {
  try {
    if (!canAccessCompanyResource(req)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this company profile.",
      });
    }

    const company = await Company.findOne({ userId: req.params.userId }).populate(
      "userId",
      "name email role createdAt"
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch company profile.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function updateCompanyProfile(req, res) {
  try {
    if (!canAccessCompanyResource(req)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this company profile.",
      });
    }

    const updates = { ...req.body };
    delete updates.userId;

    const company = await Company.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company profile updated successfully.",
      company,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update company profile.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function getCompanyDashboard(req, res) {
  try {
    if (!canAccessCompanyResource(req)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this dashboard.",
      });
    }

    const company = await Company.findOne({ userId: req.params.userId });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found.",
      });
    }

    const activePosts = await Internship.countDocuments({ companyId: company._id });

    return res.status(200).json({
      success: true,
      dashboard: {
        companyName: company.companyName,
        activePosts,
        location: company.location || "",
        industryType: company.industryType || "",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch company dashboard.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

module.exports = {
  createCompanyProfile,
  getCompanyDashboard,
  getCompanyProfile,
  updateCompanyProfile,
};
