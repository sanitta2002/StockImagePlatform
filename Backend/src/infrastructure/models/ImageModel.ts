import { Schema, model, Document, Types } from "mongoose";

export interface ImageDocument extends Document {
  userId: Types.ObjectId;
  title: string;
  imageUrl: string;
  publicId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new Schema<ImageDocument>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const ImageModel = model<ImageDocument>(
  "Image",
  imageSchema
);