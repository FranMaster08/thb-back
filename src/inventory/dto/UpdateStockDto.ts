import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class UpdateStockDto {
  @Max(10000000)
  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  stock: number;
}
