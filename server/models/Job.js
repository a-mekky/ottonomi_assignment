import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  location: {
    type: String,
    trim: true,
  },
  salary: {
    type: String,
    trim: true,
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

// Index for sorting by date
jobSchema.index({ datePosted: -1 });

export const Job = mongoose.model('Job', jobSchema);