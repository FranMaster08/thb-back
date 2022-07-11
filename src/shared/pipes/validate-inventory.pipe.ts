import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InventoryService } from '../../inventory/services/inventory.service';

@Injectable()
export class ValidateInventoryPipe implements PipeTransform {
  constructor(private readonly inventoryService: InventoryService) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    if (value.length !== 36) {
      throw new BadRequestException(
        `Inventory Id debe tener 36 caracteres (tiene ${value.length})`,
      );
    }
    if (!(await this.inventoryService.findOne({ where: { id: value } }))) {
      throw new NotFoundException('Inventory not found ');
    }

    return value;
  }
}
