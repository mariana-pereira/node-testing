import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface UserInterface extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, {
  timestamps: true,
});

UserSchema.pre<UserInterface>('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 8);
  this.password = hash;

  next();
});

export default model<UserInterface>('User', UserSchema);