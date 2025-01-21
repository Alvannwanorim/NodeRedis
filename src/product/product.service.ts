import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto, FilterDto } from './dto/product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}
  async createProduct(payload: CreateProductDto) {
    const existingName = await this.productModel.findOne({
      name: payload.name.trim(),
    });

    if (existingName) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'product already exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const product = await this.productModel.create({
        ...payload,
        name: payload.name.trim(),
        category: new mongoose.Types.ObjectId(payload.category),
      });
      return product;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'error creating product',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  buildQuery(filters: FilterDto) {
    const query: any = {};
    if (filters.name) {
      query.name = { $regex: new RegExp(filters.name, 'i') };
    }
    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
      if (filters.minPrice !== undefined) query.price.$lte = filters.maxPrice;
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $all: filters.tags };
    }

    return query;
  }
  async searchProduct(filters: FilterDto) {
    const query = this.buildQuery(filters);
    console.log('query', query);

    try {
      const products = await this.productModel.find(query).exec();
      return products;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'error fetching product',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllProducts() {
    try {
      const products = await this.productModel.find({});
      console.log('here');
      return products;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'error fetching product',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
