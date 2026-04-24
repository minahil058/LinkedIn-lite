const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getDataUri = require('../utils/datauri');
const cloudinary = require('../utils/cloudinary');
const Job = require('../models/Job');

const register = async (req, res) => {
    try {
        const { name, email, phoneNumber, password, role } = req.body;
        if (!name || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: "Something is missing", success: false });
        };
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exist with this email.', success: false });
        }
        await User.create({ name, email, phoneNumber, password, role, profile: { bio: "", skills: [], resume: "", resumeName: "", profilePhoto: "" } });
        return res.status(201).json({ message: "Account created successfully.", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ message: "Something is missing", success: false });
        };
        let user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "Incorrect email or password.", success: false });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect email or password.", success: false });
        };
        if (role !== user.role) {
            return res.status(400).json({ message: "Account doesn't exist with current role.", success: false });
        };
        const tokenData = { userId: user._id };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });
        user = { _id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber, role: user.role, profile: user.profile };
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.name}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({ message: "Logged out successfully.", success: true });
    } catch (error) {
        console.log(error);
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, email, phoneNumber, bio, skills } = req.body;
        const resumeFile = req.files?.resume?.[0];
        const profilePhotoFile = req.files?.profilePhoto?.[0];

        let resumeUrl = "", resumeOriginalName = "", profilePhotoUrl = "";

        if (resumeFile) {
            const fileUri = getDataUri(resumeFile);
            if (fileUri) {
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content, { resource_type: 'auto' });
                resumeUrl = cloudResponse.secure_url;
                resumeOriginalName = resumeFile.originalname;
            }
        }

        if (profilePhotoFile) {
            const fileUri = getDataUri(profilePhotoFile);
            if (fileUri) {
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content, { resource_type: 'auto' });
                profilePhotoUrl = cloudResponse.secure_url;
            }
        }

        let skillsArray;
        if (skills) {
            skillsArray = Array.isArray(skills) ? skills : skills.split(",").map(skill => skill.trim());
        }

        const userId = req.id;
        let user = await User.findById(userId);
        if (!user) return res.status(400).json({ message: "User not found.", success: false });

        if (name) user.name = name;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;
        if (resumeUrl) { user.profile.resume = resumeUrl; user.profile.resumeName = resumeOriginalName; }
        if (profilePhotoUrl) user.profile.profilePhoto = profilePhotoUrl;

        await user.save();

        user = { _id: user._id, name: user.name, email: user.email, role: user.role, profile: user.profile, phoneNumber: user.phoneNumber };
        return res.status(200).json({ message: "Profile updated successfully.", user, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

const saveJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found", success: false });

        const isSaved = user.profile.savedJobs.includes(jobId);
        if (isSaved) {
            await User.findByIdAndUpdate(userId, { $pull: { 'profile.savedJobs': jobId } });
            return res.status(200).json({ message: "Job removed from saved list", success: true });
        } else {
            await User.findByIdAndUpdate(userId, { $addToSet: { 'profile.savedJobs': jobId } });
            return res.status(200).json({ message: "Job saved successfully", success: true });
        }
    } catch (error) {
        console.log("Save Job Error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).populate({
            path: 'profile.savedJobs',
            populate: { path: 'company' }
        });
        if (!user) return res.status(404).json({ message: "User not found", success: false });
        return res.status(200).json({ savedJobs: user.profile.savedJobs, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

module.exports = { register, login, logout, updateProfile, saveJob, getSavedJobs };