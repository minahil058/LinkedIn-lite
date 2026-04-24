const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getDataUri = require('../utils/datauri');
const cloudinary = require('../utils/cloudinary');

const register = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, role } = req.body;

    if (!name || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false
      });
    };

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: 'User already exist with this email.',
        success: false,
      })
    }
    // DO NOT hash here, the User model pre('save') hook handles it.
    await User.create({
      name,
      email,
      phoneNumber,
      password,
      role,
      profile: {
          bio: "",
          skills: [],
          resume: "",
          resumeName: "",
          profilePhoto: ""
      }
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        message: "Internal server error",
        success: false
    });
  }
}

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false
      });
    };
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      })
    };
    // check role is correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false
      })
    };

    const tokenData = {
      userId: user._id
    }
    
    if (!process.env.SECRET_KEY) {
        console.error("CRITICAL: SECRET_KEY is missing from .env file");
        throw new Error("SECRET_KEY_MISSING");
    }

    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

    user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile
    }

    return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
      message: `Welcome back ${user.name}`,
      user,
      success: true
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        message: "Internal server error",
        success: false
    })
  }
}

const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true
    })
  } catch (error) {
    console.log(error);
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name, email, phoneNumber, bio, skills } = req.body;
    
    // Using fields middleware, files are in req.files
    const resumeFile = req.files?.resume?.[0];
    const profilePhotoFile = req.files?.profilePhoto?.[0];

    console.log("FILES_RECEIVED:", { resume: !!resumeFile, profilePhoto: !!profilePhotoFile });

    let resumeUrl = "";
    let resumeOriginalName = "";
    let profilePhotoUrl = "";

    // 1. Handle Resume Upload
    if (resumeFile) {
        console.log("PROCESSING_RESUME:", resumeFile.originalname);
        try {
            const fileUri = getDataUri(resumeFile);
            if (fileUri) {
                try {
                    const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                        resource_type: 'auto',
                        type: 'upload',
                        access_mode: 'public'
                    });
                    console.log("RESUME_UPLOAD_SUCCESS:", cloudResponse.secure_url);
                    resumeUrl = cloudResponse.secure_url;
                    resumeOriginalName = resumeFile.originalname;
                } catch (cloudErr) {
                    console.error("CLOUDINARY_RESUME_ERROR:", cloudErr);
                    // Continue without resume if upload fails
                }
            }
        } catch (err) {
            console.error("RESUME_PROCESSING_ERROR (NON-FATAL):", err.message);
            // We continue so the rest of the profile updates correctly
        }
    }

    // 2. Handle Profile Photo Upload
    if (profilePhotoFile) {
        console.log("PROCESSING_PHOTO:", profilePhotoFile.originalname);
        try {
            const fileUri = getDataUri(profilePhotoFile);
            if (fileUri) {
                try {
                    const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                        resource_type: 'auto',
                        type: 'upload',
                        access_mode: 'public'
                    });
                    console.log("PHOTO_UPLOAD_SUCCESS:", cloudResponse.secure_url);
                    profilePhotoUrl = cloudResponse.secure_url;
                } catch (cloudErr) {
                    console.error("CLOUDINARY_PHOTO_ERROR:", cloudErr);
                    // Continue without photo if upload fails
                }
            }
        } catch (err) {
            console.error("PHOTO_PROCESSING_ERROR (NON-FATAL):", err.message);
            // We continue so the rest of the profile updates correctly
        }
    }

    let skillsArray;
    if (skills) {
      skillsArray = Array.isArray(skills) ? skills : skills.split(",").map(skill => skill.trim());
    }

    const userId = req.id; 
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false
      });
    }

    // Ensure profile object exists before updating fields
    if (!user.profile) {
        user.profile = {
            bio: "",
            skills: [],
            resume: "",
            resumeName: "",
            profilePhoto: ""
        };
    }

    // Updating data
    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    // File updates
    if (resumeUrl) {
        user.profile.resume = resumeUrl;
        user.profile.resumeName = resumeOriginalName;
    }
    if (profilePhotoUrl) {
        user.profile.profilePhoto = profilePhotoUrl;
    }

    await user.save();

    user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
      phoneNumber: user.phoneNumber
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        message: "Internal server error",
        success: false
    });
  }
}

module.exports = {
  register,
  login,
  logout,
  updateProfile
};
