import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ProductDocument = Product & Document;
@Schema({
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
  timestamps: true,
})
export class Product extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: mongoose.Schema.Types.ObjectId;

  @Prop({ trim: true })
  brand: string;

  @Prop({ required: true, min: 0 })
  stock: number;

  @Prop([
    {
      url: { type: String, required: true },
      altText: { type: String, trim: true },
    },
  ])
  images: { url: string; altText: string }[];

  // @Prop({
  //   average: { type: Number, default: 0, min: 0, max: 5 },
  //   count: { type: Number, default: 0 },
  // })
  // ratings: { average: number; count: number };

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  })
  reviews: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual('product_id').get(function () {
  return this._id;
});

ProductSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};
