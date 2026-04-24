const Application = require('../models/Application');
const Job = require('../models/Job');

const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required.",
        success: false
      });
    }

    // Check if the user has already applied for the job
    const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false
      });
    }

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    }

    // Create a new application
    const { coverLetter, experience } = req.body;
    
    if (!coverLetter || !experience) {
        return res.status(400).json({
            message: "Cover letter and experience are required.",
            success: false
        });
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
      coverLetter,
      experience
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "Job applied successfully.",
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const applications = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
      path: 'job',
      options: { sort: { createdAt: -1 } },
      populate: {
        path: 'company',
        options: { sort: { createdAt: -1 } },
      }
    });

    if (!applications) {
      return res.status(404).json({
        message: "No applications found.",
        success: false
      });
    }

    return res.status(200).json({
      applications,
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// For recruiters to see who applied to their jobs
const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: 'applications',
      options: { sort: { createdAt: -1 } },
      populate: {
        path: 'applicant'
      }
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false
      });
    }

    return res.status(200).json({
      job,
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!applicationId || !status) {
      return res.status(400).json({
        message: "Application ID and Status are required.",
        success: false
      });
    }

    // Validate status against enum
    const validStatuses = ['pending', 'accepted', 'rejected'];
    const normalizedStatus = status.toLowerCase();
    if (!validStatuses.includes(normalizedStatus)) {
        return res.status(400).json({
            message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
            success: false
        });
    }

    // Find the application and update status manually with validation bypass
    const application = await Application.findById(applicationId);
    
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false
      });
    }

    application.status = normalizedStatus;
    // CRITICAL: Bypassing validation for other fields that might be missing in legacy data
    await application.save({ validateBeforeSave: false });

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false
      });
    }

    return res.status(200).json({
      message: "Status updated successfully.",
      application,
      success: true
    });
  } catch (error) {
    console.error("UPDATE_STATUS_ERROR:", error);
    return res.status(500).json({ 
        message: error.message || "Internal server error during status update", 
        success: false 
    });
  }
};

module.exports = {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateStatus
};
