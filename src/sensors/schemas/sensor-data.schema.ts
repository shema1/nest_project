import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SensorDataDocument = SensorData & Document;

@Schema({ timestamps: true })
export class SensorData {
  @Prop({ required: true, type: Number })
  temperature: number;

  @Prop({ required: true, type: Number })
  humidity: number;
}

export const SensorDataSchema = SchemaFactory.createForClass(SensorData);

