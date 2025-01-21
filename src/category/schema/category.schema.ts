import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CategoryDocument = Category & Document;
@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description: string;

  @Prop({
    default: null,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  })
  parentCategory: string | null;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};
