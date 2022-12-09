import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";
import config from "../config/index";
import AuthRoles from "../utils/authRoles";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      maxLength: [50, "name must be less than 50"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "password must be minimum 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(AuthRoles),
      default: AuthRoles.USER,
    },
    forgetPasswordToken: String,
    forgetPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

// challenge 1- encrypt password- hooks
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// add more features directly to your schema
userSchema.methods = {
  comparePassword: async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },

  // generate JWT token
  getJwtToken: function () {
    return JWT.sign(
      {
        _id: this._id,
        role: this.role,
      },
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_EXPIRY,
      }
    );
  },

  generateForgetPasswordToken: function () {
    const forgotToken = crypto.randomBytes(20).toString("hex");

    // step 1 - save to DB
    this.forgetPasswordToken = crypto
      .createHash("sha256")
      .update(forgotToken)
      .digest("hex");

    this.forgetPasswordExpiry = Date.now() + 20 + 60 * 1000;

    // step 2 - return values to user
    return forgotToken;
  },
};

export default mongoose.model("User", userSchema);
