import mongoose from 'mongoose';

const emailTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tokenHash: { type: String, required: true },
  type: { type: String, enum: ['verify', 'reset'], required: true },
  expiresAt: { type: Date, required: true },
  usedAt: { type: Date }
}, { timestamps: true });

emailTokenSchema.index({ user: 1, type: 1 });

export default mongoose.model('EmailToken', emailTokenSchema);
