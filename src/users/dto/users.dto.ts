import { IsNotEmpty } from 'class-validator';
import { RoleType } from '../../role/roletype.enum';

// NO SE USA

export class UsersDto {
  @IsNotEmpty()
  nombre: string;

  roles: RoleType[];
}
