import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { FilterListingDto } from './dto/filter-listing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/roles.enum';

@ApiTags('Listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Browse all active listings (public)' })
  findAll(@Query() filters: FilterListingDto) {
    return this.listingsService.findAll(filters);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LANDLORD)
  @Get('mine')
  @ApiOperation({ summary: 'Get my listings (landlord)' })
  myListings(@CurrentUser() user: { sub: string }) {
    return this.listingsService.findByLandlord(user.sub);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single listing (public)' })
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LANDLORD)
  @Post()
  @ApiOperation({ summary: 'Create a listing (landlord only)' })
  create(@CurrentUser() user: any, @Body() dto: CreateListingDto) {
    return this.listingsService.create(user.sub, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LANDLORD)
  @Patch(':id')
  @ApiOperation({ summary: 'Update my listing' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateListingDto,
  ) {
    return this.listingsService.update(id, user.sub, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LANDLORD)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete my listing' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.listingsService.remove(id, user.sub);
  }
}
