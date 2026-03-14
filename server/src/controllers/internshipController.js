const Company = require("../models/Company");
const Internship = require("../models/Internship");

async function createInternship(req, res) {
  try {
    if (!["company", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only companies or admins can create internships.",
      });
    }

    const company =
      req.user.role === "admin" && req.body.companyId
        ? await Company.findById(req.body.companyId)
        : await Company.findOne({ userId: req.user._id });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found. Create company profile first.",
      });
    }

    const internship = await Internship.create({
      ...req.body,
      companyId: company._id,
      companyName: company.companyName,
    });

    return res.status(201).json({
      success: true,
      message: "Internship created successfully.",
      internship,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create internship.",
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

async function getInternshipById(req, res) {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found.",
      });
    }

    return res.status(200).json({
      success: true,
      internship,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch internship.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function updateInternship(req, res) {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found.",
      });
    }

    const updates = { ...req.body };
    delete updates.companyId;
    delete updates.companyName;

    if (req.user.role !== "admin") {
      const company = await Company.findOne({ userId: req.user._id });

      if (!company || company._id.toString() !== internship.companyId.toString()) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to update this internship.",
        });
      }
    }

    Object.assign(internship, updates);
    const updatedInternship = await internship.save();

    return res.status(200).json({
      success: true,
      message: "Internship updated successfully.",
      internship: updatedInternship,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update internship.",
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

    if (req.user.role !== "admin") {
      const company = await Company.findOne({ userId: req.user._id });

      if (!company || company._id.toString() !== internship.companyId.toString()) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to delete this internship.",
        });
      }
    }

    await internship.deleteOne();

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

async function getCompanyInternships(req, res) {
  try {
    const internships = await Internship.find({ companyId: req.params.companyId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: internships.length,
      internships,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch company internships.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

module.exports = {
  createInternship,
  deleteInternship,
  getCompanyInternships,
  getInternshipById,
  getInternships,
  updateInternship,
};
