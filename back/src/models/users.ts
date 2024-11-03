import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: false, trim: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    select: false,
    trim: true,
    minlength: 6,
    maxlength: 100,
  },
  role: { type: String, enum: ["admin", "editor"], default: "editor" },
  browserFingerprint: { type: String, default: null, select: false },
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    if (this.isNew || this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    next();
  } catch (error: any) {
    next(error);
  }
});

const UserModel = mongoose.model("users", userSchema);
export default UserModel;
