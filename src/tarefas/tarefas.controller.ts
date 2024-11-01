import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TarefasService } from './tarefas.service';
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@Controller('tarefas')
export class TarefasController {
  constructor(private readonly tarefasService: TarefasService) { }

  @Post()
  async create(@Body() createTarefaDto: CreateTarefaDto): Promise<ApiResponse<any>> {
    const response = await this.tarefasService.create(createTarefaDto);
    return response;
  }

  @Get()
  async findAll(): Promise<ApiResponse<any[]>> {
    const response = await this.tarefasService.findAll();
    return response;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTarefaDto: UpdateTarefaDto): Promise<ApiResponse<any>> {
    const response = await this.tarefasService.update(+id, updateTarefaDto);
    return response;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<null>> {
    const response = await this.tarefasService.delete(+id);
    return response;
  }

  @Post('/reorder')
  async atualizarOrdem(@Body() posicoes: { id: number; novaOrdem: number }[]): Promise<ApiResponse<null>> {
    const response = await this.tarefasService.atualizarOrdem(posicoes);
    return response;
  }

  @Patch(':id/move-up')
  async moverParaCima(@Param('id') id: string): Promise<ApiResponse<null>> {
    const response = await this.tarefasService.moverParaCima(+id);
    return response;
  }

  @Patch(':id/move-down')
  async moverParaBaixo(@Param('id') id: string): Promise<ApiResponse<null>> {
    const response = await this.tarefasService.moverParaBaixo(+id);
    return response;
  }
}
