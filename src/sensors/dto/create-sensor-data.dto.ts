import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateSensorDataDto {
  @ApiProperty({
    description: 'Temperature in Celsius',
    example: 25.5,
    minimum: -50,
    maximum: 60,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(-50)
  @Max(60)
  temperature: number;

  @ApiProperty({
    description: 'Humidity percentage',
    example: 65.5,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  humidity: number;
}

