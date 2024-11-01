import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTarefaDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)  
  custo?: number;

  @IsDateString()  
  @IsOptional()
  dataLimite?: string;

  @IsNumber()
  @IsOptional()
  ordem?: number;
}
