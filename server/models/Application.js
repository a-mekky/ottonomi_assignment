import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required'],
  },
  cvPath: {
    type: String,
    required: [true, 'CV file is required'],
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for querying applications by job
applicationSchema.index({ jobId: 1, appliedAt: -1 });
// Index for unique email per job to prevent duplicate applications
applicationSchema.index({ email: 1, jobId: 1 }, { unique: true });

export const Application = mongoose.model('Application', applicationSchema);