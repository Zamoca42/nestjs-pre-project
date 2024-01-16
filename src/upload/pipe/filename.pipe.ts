import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UploadService } from '../../upload/upload.service';
import { Entity } from '../../common/constant/entity.enum';

/**
 * Validator supports service container in the case if want to inject dependencies into your custom validator constraint classes
 * @see also https://github.com/leosuncin/nest-api-example/blob/master/src/blog/pipes/article.pipe.ts
 * @see also https://github.com/typestack/class-validator?tab=readme-ov-file#using-service-container
 * @see also https://docs.nestjs.com/techniques/validation
 */
@Injectable()
export class FilenamePipe
  implements PipeTransform<Express.Multer.File, Promise<Express.Multer.File>>
{
  constructor(private readonly appService: UploadService) {}

  async transform(value: Express.Multer.File): Promise<Express.Multer.File> {
    const fileOriginalname = value.originalname;
    const filename = this.appService.parseFilename(fileOriginalname);

    if (!filename) {
      throw new NotFoundException(
        `'${Entity.CUSTOMER}' or '${Entity.ORDER}' not found`,
      );
    }

    return value;
  }
}
