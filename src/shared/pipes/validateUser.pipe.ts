import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ValidateUserPipe implements PipeTransform {
  async transform(value: string, metadata: ArgumentMetadata) {
    if (value.length !== 36) {
      throw new BadRequestException(
        `User Id must be 36 characters (has ${value.length})`,
      );
    }

    return value;
  }
}
