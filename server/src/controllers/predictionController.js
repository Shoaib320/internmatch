const Internship = require("../models/Internship");
const Prediction = require("../models/Prediction");
const StudentProfile = require("../models/StudentProfile");

async function recommendInternships(req, res) {
  try {
    if (!["student", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only students or admins can request recommendations.",
      });
    }

    const studentProfile =
      req.user.role === "admin" && req.body.studentId
        ? await StudentProfile.findById(req.body.studentId)
        : await StudentProfile.findOne({ userId: req.user._id });

    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found. Create student profile first.",
      });
    }

    const internships = await Internship.find();

    if (!internships.length) {
      return res.status(200).json({
        success: true,
        message: "No internship posts are available yet.",
        predictedRoles: [],
        engine: "awaiting-internships",
        fallbackReason: "No internship posts are available yet. Add internships from the company dashboard first.",
        recommendations: [],
      });
    }

    const mlResponse = await fetchMlRecommendations(studentProfile, internships);
    const recommendations = mlResponse.recommendations;

    const prediction = await Prediction.create({
      studentId: studentProfile._id,
      recommendations,
      predictedRoles: mlResponse.predictedRoles || [],
      engine: mlResponse.engine,
      fallbackReason: mlResponse.fallbackReason,
    });

    return res.status(200).json({
      success: true,
      message: "Recommendations generated successfully.",
      predictionId: prediction._id,
      predictedRoles: mlResponse.predictedRoles || [],
      engine: mlResponse.engine,
      fallbackReason: mlResponse.fallbackReason,
      recommendations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate recommendations.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function getPredictionHistory(req, res) {
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
        message: "You do not have permission to view this prediction history.",
      });
    }

    const predictions = await Prediction.find({ studentId: req.params.studentId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: predictions.length,
      predictions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch prediction history.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function fetchMlRecommendations(studentProfile, internships) {
  const mlServiceUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

  try {
    const response = await fetchWithTimeout(`${mlServiceUrl}/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentProfile: serializeStudentProfile(studentProfile),
        internships: internships.map(serializeInternship),
      }),
    });

    if (!response.ok) {
      throw new Error(`ML service responded with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "ML service returned an unsuccessful response.");
    }

    return {
      engine: "flask-ml-service",
      predictedRoles: data.predictedRoles || [],
      recommendations: data.recommendations || [],
    };
  } catch (error) {
    const recommendations = internships
      .map((internship) => buildFallbackRecommendation(studentProfile, internship))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 4);

    return {
      engine: "rule-based-fallback",
      predictedRoles: [],
      recommendations,
      fallbackReason: error.message,
    };
  }
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeTextArray(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .filter(Boolean)
    .map((value) => String(value).trim().toLowerCase())
    .filter(Boolean);
}

function serializeStudentProfile(studentProfile) {
  return {
    degree: studentProfile.degree,
    branch: studentProfile.branch,
    year: studentProfile.year,
    cgpa: studentProfile.cgpa,
    skills: studentProfile.skills || [],
    certifications: studentProfile.certifications || [],
    projects: studentProfile.projects || [],
    preferred_role: studentProfile.preferredRole,
    preferred_location: studentProfile.preferredLocation,
    internship_type: studentProfile.internshipType,
  };
}

function serializeInternship(internship) {
  return {
    _id: internship._id.toString(),
    internshipTitle: internship.internshipTitle,
    companyName: internship.companyName,
    requiredSkills: internship.requiredSkills || [],
    preferredBranch: internship.preferredBranch || [],
    minimumCgpa: internship.minimumCgpa,
    yearEligible: internship.yearEligible || [],
    location: internship.location,
    internshipType: internship.internshipType,
    domain: internship.domain,
  };
}

function buildFallbackRecommendation(studentProfile, internship) {
  const studentSkills = normalizeTextArray(studentProfile.skills);
  const requiredSkills = normalizeTextArray(internship.requiredSkills);
  const preferredBranches = normalizeTextArray(internship.preferredBranch);
  const eligibleYears = normalizeTextArray(internship.yearEligible);
  const matchedSkills = studentSkills.filter((skill) => requiredSkills.includes(skill));
  const missingSkills = requiredSkills.filter((skill) => !studentSkills.includes(skill));

  let score = 0;

  if (requiredSkills.length > 0) {
    score += Math.round((matchedSkills.length / requiredSkills.length) * 40);
  }

  if (studentProfile.cgpa >= (internship.minimumCgpa || 0)) {
    score += 15;
  }

  if (
    preferredBranches.length === 0 ||
    preferredBranches.includes((studentProfile.branch || "").toLowerCase())
  ) {
    score += 15;
  }

  if (
    internship.internshipType &&
    studentProfile.internshipType &&
    internship.internshipType.toLowerCase() === studentProfile.internshipType.toLowerCase()
  ) {
    score += 10;
  }

  if (
    internship.location &&
    studentProfile.preferredLocation &&
    internship.location.toLowerCase() === studentProfile.preferredLocation.toLowerCase()
  ) {
    score += 10;
  }

  if (
    internship.domain &&
    studentProfile.preferredRole &&
    internship.domain.toLowerCase().includes(studentProfile.preferredRole.toLowerCase())
  ) {
    score += 10;
  }

  if (
    eligibleYears.length === 0 ||
    eligibleYears.includes((studentProfile.year || "").toLowerCase())
  ) {
    score += 5;
  }

  return {
    internshipId: internship._id,
    internshipTitle: internship.internshipTitle,
    companyName: internship.companyName,
    matchScore: Math.min(score, 100),
    matchedSkills,
    missingSkills,
    location: internship.location,
    internshipType: internship.internshipType,
  };
}

module.exports = { getPredictionHistory, recommendInternships };
