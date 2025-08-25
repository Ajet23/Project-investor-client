import mongoose from 'mongoose';

const roleInfoSchema = new mongoose.Schema({
  // Optional role-specific fields. Validation is done at controller level.
  industry: { type: String },
  ideaStage: { type: String },
  firmName: { type: String },
  investmentRange: { type: String },
  expertise: { type: String },
  yearsExperience: { type: Number }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Thinker', 'Investor', 'Mentor'], required: true },
  roleInfo: roleInfoSchema,
  isEmailVerified: { type: Boolean, default: false }
}, { timestamps: true });


export default mongoose.model('User', userSchema);
