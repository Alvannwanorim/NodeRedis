import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateProductDto, FilterDto } from './dto/product.dto';

@Controller('product')
@UseInterceptors(CacheInterceptor)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Get('')
  @CacheKey('product:getAllProducts')
  @CacheTTL(60000)
  async getAllProducts() {
    return await this.productService.getAllProducts();
  }

  @Post('')
  async createProduct(@Body() payload: CreateProductDto) {
    const product = await this.productService.createProduct(payload);
    return product;
  }

  @Get('/search')
  async searchProducts(@Query() filters: FilterDto) {
    console.log('here');
    return await this.productService.searchProduct(filters);
  }
}
