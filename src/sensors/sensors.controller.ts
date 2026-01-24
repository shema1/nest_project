import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SensorsService } from './sensors.service';
import { CreateSensorDataDto } from './dto/create-sensor-data.dto';
import { GetSensorDataQueryDto } from './dto/get-sensor-data-query.dto';

@ApiTags('sensors')
@Controller('sensors')
export class SensorsController {
  private readonly logger = new Logger(SensorsController.name);

  constructor(private readonly sensorsService: SensorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create sensor data' })
  @ApiResponse({
    status: 201,
    description: 'Sensor data has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createSensorDataDto: CreateSensorDataDto) {
    return this.sensorsService.create(createSensorDataDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sensor data with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of sensor data with pagination metadata.',
  })
  async findAll(@Query() query: GetSensorDataQueryDto) {
    return this.sensorsService.findAll(query);
  }

  @Post('test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Test endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Test endpoint response.',
  })
  async test(@Body() body: Record<string, unknown>) {
    this.logger.log(`Test payload: ${JSON.stringify(body)}`);
    return { message: 'Test endpoint response.', body };
  }
}

