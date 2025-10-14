import mongoose, { Schema } from "mongoose";

export interface INews {
  title: string;
  content: string;
  category: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  like?: number;
  dislike?: number;
}

const NewsSchema: Schema<INews> = new Schema(
  {
    title: { type: String, required: true, minlength: 2, trim: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    content: { type: String, required: true, minlength: 150, maxlength: 4000, trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    isActive: { type: Boolean, default: false },// User referansı
    like: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 }
  },
  {
    timestamps: true // createdAt ve updatedAt otomatik yönetilir. Serviste bu değerlerle uğraşmamıza gerek yok.
  }
);

//otomatik tarih alımı ara katman kancası
NewsSchema.pre("save", function (next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

const News = mongoose.model<INews>("News", NewsSchema);
export default News;