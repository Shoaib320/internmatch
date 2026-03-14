const cors = require("cors");
const express = require("express");
const morgan = require("morgan");

const adminRoutes = require("./routes/adminRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes");
const internshipRoutes = require("./routes/internshipRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const studentRoutes = require("./routes/studentRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const app = express();

const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:3000,http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    message: "Internship platform backend is running",
  });
});

app.get("/api/health", (req, res) => {
  checkMlService()
    .then((mlService) => {
      res.status(200).json({
        success: true,
        message: "Server is healthy",
        mlService,
      });
    })
    .catch(() => {
      res.status(200).json({
        success: true,
        message: "Server is healthy",
        mlService: {
          status: "unreachable",
        },
      });
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

async function checkMlService() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  const mlServiceUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

  try {
    const response = await fetch(`${mlServiceUrl}/health`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`ML service responded with status ${response.status}`);
    }

    const data = await response.json();

    return {
      status: "connected",
      dataset: data.dataset,
      labels: data.labels,
    };
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = app;
