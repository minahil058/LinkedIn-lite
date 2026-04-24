const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  coverLetter: {
    type: String,
    required: [true, 'Please provide a cover letter'],
    minlength: [50, 'Cover letter must be at least 50 characters']
  },
  experience: {
    type: String,
    required: [true, 'Please provide your years of experience']
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
