import {
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { FilenamePipe } from './upload/pipe/filename.pipe';
import { ResponseEntity } from './common/entity/response.entity';
import { OrderQueryParam } from './order/dto/req-order-query.dto';
import { SwaggerAPI } from './common/swagger/api.decorator';
import { GetOrderList } from './order/dto/get-order-list.dto';
import { Order } from './order/entity/order.entity';
import { PageEntity } from './common/dto/get-pagination-list.dto';
import { OrderService } from './order/order.service';
import { FileAPI } from './upload/swagger/file-api.decorator';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly orderService: OrderService,
  ) {}

  @Post('upload')
  @SwaggerAPI({ name: 'CSV 파일 업로드', success: 201 })
  @FileAPI()
  handleCSVFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'csv' })],
      }),
      FilenamePipe,
    )
    file: Express.Multer.File,
  ) {
    const saveCount = this.appService.saveCsvData(file);
    const filename = this.appService.parseFilename(file);
    return ResponseEntity.CREATED(
      `Successfully saved ${saveCount} ${filename}`,
    );
  }

  @Get('order')
  @SwaggerAPI({
    name: '주문 목록 조회',
    model: GetOrderList,
    isPagination: true,
  })
  //TODO: startDate, endDate validation pipe
  async findManyOrderByQueryParam(@Query() params: OrderQueryParam) {
    const [response, count] =
      await this.orderService.findOrderByOptionsAndCount(
        params.getPageProps(),
        params.getQueryProps(),
      );
    return ResponseEntity.OK_WITH(
      `Successfully find ${count} orders`,
      PageEntity.create(
        params.getPageProps(),
        response.map((data: Order) => new GetOrderList(data)),
        count,
      ),
    );
  }
}
