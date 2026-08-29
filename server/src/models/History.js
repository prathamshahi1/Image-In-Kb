import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    filename: {
      type: String,
      required: true,
      trim: true
    },
    operation: {
      type: String,
      enum: ['COMPRESS', 'RESIZE', 'CONVERT', 'EDIT', 'BATCH'],
      default: 'COMPRESS'
    },
    originalSizeBytes: {
      type: Number,
      required: true
    },
    finalSizeBytes: {
      type: Number,
      required: true
    },
    savingsPercent: {
      type: Number,
      default: 0
    },
    outputFormat: {
      type: String,
      default: 'JPG'
    },
    status: {
      type: String,
      default: 'SUCCESS'
    }
  },
  {
    timestamps: true
  }
);

const History = mongoose.models.History || mongoose.model('History', historySchema);
export default History;
