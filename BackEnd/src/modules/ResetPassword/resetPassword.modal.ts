import mongoose, { Schema } from "mongoose";

const resetPasswordSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);
resetPasswordSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);
export default mongoose.model("resetpassword", resetPasswordSchema);