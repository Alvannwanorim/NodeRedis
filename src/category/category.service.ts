import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { Model } from 'mongoose';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}
  async createCategory(payload: CreateCategoryDto) {
    const existingName = await this.categoryModel.findOne({
      name: payload.name.trim(),
    });

    if (existingName) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'category already exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const data = await this.categoryModel.create({
        ...payload,
        name: payload.name.trim(),
      });
      return data;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'error creating category',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async getAllCategories() {
    try {
      const categories = await this.categoryModel.find({});
      return categories;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'error fetching categories',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
