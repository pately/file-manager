import * as fs from 'fs';
import {
  Controller,
  Post,
  Get,
  Headers,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
  Param,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiProperty,
  ApiParam,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, fileFilter } from '../utils/file-upload.utils';
import { FileService } from './file.service';
import { config } from '../config';

class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'text' })
  file: any;
}

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {
    if (!fs.existsSync(config.fileDirectory)) {
      fs.mkdirSync(config.fileDirectory);
    }
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: fileFilter,
      limits: { fileSize: 1024 * 1024 },
    }),
  )
  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({
    status: 413,
    description: 'File too large. Max upload limit 1MB',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'file upload',
    type: FileUploadDto,
  })
  async uploadFile(@Req() req, @UploadedFile() file) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }

    if (!file) {
      throw new BadRequestException('invalid file');
    }
    return await this.fileService.uploadFile(file);
  }

  @Get('random')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  getRandomLine(@Headers() headers) {
    return headers['content-type'] === 'application/*'
      ? this.fileService.getRandomLineWithAttributes()
      : this.fileService.getRandomLine();
  }

  @Get('random_back')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  getRandomLineBackwards() {
    return this.fileService.getRandomLineBackwards();
  }

  @Get('top20/:fileName?')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @ApiParam({
    name: 'fileName',
    type: 'string',
    required: false,
    allowEmptyValue: true,
  })
  getTop20LinesByFile(@Param('fileName') fileName) {
    return this.fileService.getTop20LinesByFile(fileName);
  }

  @Get('top100')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  getTop100Lines() {
    return this.fileService.getTop100Lines();
  }
}
