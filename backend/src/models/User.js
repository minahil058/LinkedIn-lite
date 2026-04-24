const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide a phone number']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false // Don't return password by default
  },
  role: {
    type: String,
    enum: ['candidate', 'recruiter', 'admin'],
    default: 'candidate'
  },
  profile: {
    bio: String,
    skills: [String],
    resume: String, // URL to resume
    resumeName: String,
    profilePhoto: String,
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
      }
    ]
  }
}, { timestamps: true });

// Hash password before saving
// Using async function without next parameter - the most stable modern Mongoose pattern
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  
  try {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
