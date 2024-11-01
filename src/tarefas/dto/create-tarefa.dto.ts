import { IsString, IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateTarefaDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsNumber()
  @IsNotEmpty()
  custo: number;

  @IsDateString()
  dataLimite: string;
}
