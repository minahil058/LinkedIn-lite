const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide job title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide job description']
  },
  requirements: [String],
  salary: {
    type: Number,
    required: [true, 'Please provide salary']
  },
  location: {
    type: String,
    required: [true, 'Please provide job location']
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
    default: 'Full-time'
  },
  experienceLevel: {
    type: String,
    required: true
  },
  position: {
    type: Number,
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
