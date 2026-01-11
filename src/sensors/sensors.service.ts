import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SensorData, SensorDataDocument } from './schemas/sensor-data.schema';
import { CreateSensorDataDto } from './dto/create-sensor-data.dto';
import { GetSensorDataQueryDto } from './dto/get-sensor-data-query.dto';

export interface PaginatedSensorData {
  data: SensorData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class SensorsService {
  constructor(
    @InjectModel(SensorData.name)
    private sensorDataModel: Model<SensorDataDocument>,
  ) {}

  async create(createSensorDataDto: CreateSensorDataDto): Promise<SensorData> {
    const createdData = new this.sensorDataModel(createSensorDataDto);
    return createdData.save();
  }

  async findAll(
    query: GetSensorDataQueryDto,
  ): Promise<PaginatedSensorData> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.sensorDataModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.sensorDataModel.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
}

