import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  coverImageUrl?: string;
  author: mongoose.Types.ObjectId;
  tags?: string[];
  categories?: mongoose.Types.ObjectId[];
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    coverImageUrl: { type: String, trim: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String, trim: true }],
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date }
  },
  { timestamps: true }
);

blogSchema.pre('validate', function (next) {
  const doc = this as IBlog;
  if (doc.isPublished && !doc.publishedAt) {
    doc.publishedAt = new Date();
  }
  next();
});

export const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema);

export default Blog;