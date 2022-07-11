import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleType } from 'src/role/roletype.enum';
import { IStock } from 'src/shared/interfaces/inventory.interfacesy';
import { TypeResponse } from 'src/shared/types/response.type';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { CreateStockDto } from '../dto/CreateStockDto';
import { UpdateStockDto } from '../dto/UpdateStockDto';
import { InventoryEntity } from '../entities/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryEntity, 'thv-db')
    private readonly inventoryRepository: Repository<InventoryEntity>,
    private readonly usersService: UsersService,
  ) {}

  async addInventory(stock: CreateStockDto): Promise<InventoryEntity> {
    if (
      !(await this.usersService.findOne({
        where: { id: stock.doctorId, role: RoleType.DOCTOR },
      }))
    ) {
      throw new NotFoundException('Doctor not found');
    }

    const add = new InventoryEntity();
    add.doctorId = stock.doctorId;
    add.sku = stock.sku;
    add.name = stock.name;
    add.stock = stock.stock;

    return await this.inventoryRepository.save(add);
  }

  async getInventory(id: string): Promise<InventoryEntity[]> {
    if (
      !(await this.usersService.findOne({
        where: { id, role: RoleType.DOCTOR },
      }))
    ) {
      throw new NotFoundException('Doctor not found');
    }

    return await this.inventoryRepository.find({ where: { doctorId: id } });
  }

  async updateInventory(
    id: string,
    body: UpdateStockDto,
  ): Promise<InventoryEntity> {
    const uptated = await this.inventoryRepository.update(id, {
      stock: body.stock,
    });
    if (!uptated.affected) {
      throw new ConflictException('Inventory has not been updated');
    }

    return await this.inventoryRepository.findOne(id);
  }

  async deleteInventory(id: string): Promise<TypeResponse> {
    const deleted = await this.inventoryRepository.delete(id);
    if (!deleted.affected) {
      throw new ConflictException('Inventory has not been deleted');
    }
    return {
      statusCode: 1,
      message: 'Inventory has been deleted',
    };
  }

  async findOne(config: { where: IStock }): Promise<InventoryEntity> {
    return this.inventoryRepository.findOne({ ...config });
  }
}
