import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TypeResponse } from 'src/shared/types/response.type';
import { ValidateInventoryPipe } from '../../shared/pipes/validate-inventory.pipe';
import { CreateStockDto } from '../dto/CreateStockDto';
import { UpdateStockDto } from '../dto/UpdateStockDto';
import { InventoryEntity } from '../entities/inventory.entity';
import { InventoryService } from '../services/inventory.service';

@Controller('inventory')
@UseGuards(AuthGuard('jwt'))
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async addInventory(@Body() stock: CreateStockDto): Promise<InventoryEntity> {
    return await this.inventoryService.addInventory(stock);
  }

  @Get('doctor/:id')
  async getInventory(@Param('id') id: string): Promise<InventoryEntity[]> {
    return await this.inventoryService.getInventory(id);
  }

  @Put(':id/stock')
  async updateInventory(
    @Param('id', ValidateInventoryPipe) id: string,
    @Body() body: UpdateStockDto,
  ): Promise<InventoryEntity> {
    return await this.inventoryService.updateInventory(id, body);
  }

  @Delete(':id')
  async deleteInventory(
    @Param('id', ValidateInventoryPipe) id: string,
  ): Promise<TypeResponse> {
    return await this.inventoryService.deleteInventory(id);
  }
}
