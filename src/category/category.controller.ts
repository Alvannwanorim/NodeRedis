import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/product.dto';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('category')
@UseInterceptors(CacheInterceptor)
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Get('')
  @CacheKey('category:getAllCategories') // Set custom cache key
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }

  @Post('')
  async createCategory(@Body() payload: CreateCategoryDto) {
    const result = await this.categoryService.createCategory(payload);
    await this.cacheManager.del('category:getAllCategories');

    return result;
  }
}
