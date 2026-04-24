const Job = require('../models/Job');
const User = require('../models/User');

const postJob = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
    const userId = req.id;

    if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId
    });

    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true
    });
  } catch (error) {
    console.error("Post Job Error:", error);
    return res.status(500).json({ 
        message: "Internal server error during job posting", 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        success: false 
    });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ]
    };
    const jobs = await Job.find(query).populate({
      path: "company"
    }).sort({ createdAt: -1 });

    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false
      });
    }

    return res.status(200).json({
      jobs,
      success: true
    });
  } catch (error) {
    console.error("Get All Jobs Error:", error);
    return res.status(500).json({ 
        message: "Internal server error while fetching jobs", 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        success: false 
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications"
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false
      });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// For recruiters to see jobs they created
const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: 'company',
      createdAt: -1
    });

    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false
      });
    }

    return res.status(200).json({
      jobs,
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

const updateJob = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, jobType, experience, position } = req.body;
    const jobId = req.params.id;

    const updateData = {
      title,
      description,
      requirements: requirements?.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position
    };

    const job = await Job.findByIdAndUpdate(jobId, updateData, { new: true });

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false
      });
    }

    return res.status(200).json({
      message: "Job updated successfully.",
      job,
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

const saveJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const isSaved = user.profile.savedJobs.includes(jobId);
    
    if (isSaved) {
      // Atomic pull to remove duplicate if any
      await User.findByIdAndUpdate(userId, {
        $pull: { 'profile.savedJobs': jobId }
      });
      return res.status(200).json({ message: "Job removed from saved list", success: true });
    } else {
      // Atomic addToSet to prevent duplicates
      await User.findByIdAndUpdate(userId, {
        $addToSet: { 'profile.savedJobs': jobId }
      });
      return res.status(200).json({ message: "Job saved successfully", success: true });
    }
  } catch (error) {
    console.log("Save Job Error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

const getSavedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).populate({
      path: 'profile.savedJobs',
      populate: {
        path: 'company'
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found.", success: false });
    }

    return res.status(200).json({
      savedJobs: user.profile.savedJobs,
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = {
  postJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
  updateJob,
  saveJob,
  getSavedJobs
};
