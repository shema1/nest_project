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
    const roundedData = {
      ...createSensorDataDto,
      temperature: Math.round(createSensorDataDto.temperature * 10) / 10,
      humidity: Math.round(createSensorDataDto.humidity * 10) / 10,
    };
    const createdData = new this.sensorDataModel(roundedData);
    return createdData.save();
  }

  async findAll(
    query: GetSensorDataQueryDto,
  ): Promise<PaginatedSensorData> {
    const { page = 1, limit = 10, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    // Build filter for date range
    const filter: any = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    const [data, total] = await Promise.all([
      this.sensorDataModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.sensorDataModel.countDocuments(filter).exec(),
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

