import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Tarefa } from './entities/tarefa.entity';
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';
import { ApiResponse, ApiResponseSuccess, ApiResponseError } from '../common/dto/api-response.dto';

@Injectable()
export class TarefasService {
  constructor(
    @InjectRepository(Tarefa)
    private tarefaRepository: Repository<Tarefa>,
    private dataSource: DataSource, 
  ) {}

  async create(createTarefaDto: CreateTarefaDto): Promise<ApiResponseSuccess<Tarefa> | ApiResponseError> {
    try {
      const tarefaExiste = await this.tarefaRepository.findOne({ where: { nome: createTarefaDto.nome } });
      if (tarefaExiste) {
        return { success: false, message: 'Tarefa com esse nome já existe.', data: null };
      }

      const ordem = (await this.tarefaRepository.count()) + 1;
      const tarefa = this.tarefaRepository.create({ ...createTarefaDto, ordem });
      const savedTarefa = await this.tarefaRepository.save(tarefa);

      return { success: true, message: 'Tarefa criada com sucesso.', data: savedTarefa };
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      return { success: false, message: 'Erro ao criar tarefa.', data: null };
    }
  }

  async findAll(): Promise<ApiResponseSuccess<Tarefa[]> | ApiResponseError> {
    try {
      const tarefas = await this.tarefaRepository.find({ order: { ordem: 'ASC' } });
      return { success: true, message: 'Tarefas carregadas com sucesso.', data: tarefas };
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      return { success: false, message: 'Erro ao carregar tarefas.', data: null };
    }
  }

  async update(id: number, updateTarefaDto: UpdateTarefaDto): Promise<ApiResponseSuccess<Tarefa> | ApiResponseError> {
    try {
      const tarefa = await this.tarefaRepository.findOne({ where: { id } });
      if (!tarefa) {
        return { success: false, message: 'Tarefa não encontrada.', data: null };
      }

      if (updateTarefaDto.nome && updateTarefaDto.nome !== tarefa.nome) {
        const tarefaExiste = await this.tarefaRepository.findOne({ where: { nome: updateTarefaDto.nome } });
        if (tarefaExiste) {
          return { success: false, message: 'Tarefa com esse nome já existe.', data: null };
        }
      }

      Object.assign(tarefa, updateTarefaDto);
      const updatedTarefa = await this.tarefaRepository.save(tarefa);

      return { success: true, message: 'Tarefa atualizada com sucesso.', data: updatedTarefa };
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      return { success: false, message: 'Erro ao atualizar tarefa.', data: null };
    }
  }

  async delete(id: number): Promise<ApiResponseSuccess<null> | ApiResponseError> {
    try {
      const tarefa = await this.tarefaRepository.findOne({ where: { id } });
      if (!tarefa) {
        return { success: false, message: 'Tarefa não encontrada.', data: null };
      }

      await this.tarefaRepository.remove(tarefa);
      const restabelecerResultado = await this.restabelecerOrdem();

      if (!restabelecerResultado.success) {
        return { success: false, message: 'Erro ao restabelecer a ordem das tarefas.', data: null };
      }

      return { success: true, message: 'Tarefa excluída com sucesso.', data: null };
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      return { success: false, message: 'Erro ao excluir tarefa.', data: null };
    }
  }

  private async restabelecerOrdem(): Promise<ApiResponseSuccess<null> | ApiResponseError> {
    try {
      const tarefas = await this.tarefaRepository.find({ order: { ordem: 'ASC' } });
      for (let i = 0; i < tarefas.length; i++) {
        if (tarefas[i].ordem !== i + 1) {
          tarefas[i].ordem = i + 1;
          await this.tarefaRepository.save(tarefas[i]);
        }
      }
      return { success: true, message: 'Ordem restabelecida com sucesso.', data: null };
    } catch (error) {
      console.error('Erro ao restabelecer ordem:', error);
      return { success: false, message: 'Erro ao restabelecer ordem.', data: null };
    }
  }

  async atualizarOrdem(posicoes: { id: number; novaOrdem: number }[]): Promise<ApiResponseSuccess<null> | ApiResponseError> {
    try {
      await this.dataSource.transaction(async (manager) => {
        
        for (const posicao of posicoes) {
          await manager.update(Tarefa, posicao.id, { ordem: -posicao.novaOrdem });
        }

        
        for (const posicao of posicoes) {
          const tarefa = await manager.findOne(Tarefa, { where: { id: posicao.id } });
          if (tarefa) {
            tarefa.ordem = posicao.novaOrdem;
            await manager.save(tarefa);
          } else {
            throw new Error(`Tarefa com ID ${posicao.id} não encontrada.`);
          }
        }
      });

      return { success: true, message: 'Ordens atualizadas com sucesso.', data: null };
    } catch (error) {
      console.error('Erro ao atualizar ordens:', error);
      return { success: false, message: 'Erro ao atualizar ordens.', data: null };
    }
  }

  async moverParaCima(id: number): Promise<ApiResponseSuccess<null> | ApiResponseError> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const tarefa = await manager.findOne(Tarefa, { where: { id } });
        if (!tarefa || tarefa.ordem === 1) {
          throw new Error('Movimento inválido.');
        }

        const tarefaAcima = await manager.findOne(Tarefa, { where: { ordem: tarefa.ordem - 1 } });
        if (!tarefaAcima) {
          throw new Error('Tarefa acima não encontrada.');
        }

        
        await manager.update(Tarefa, tarefaAcima.id, { ordem: 0 }); 
        await manager.update(Tarefa, tarefa.id, { ordem: tarefa.ordem - 1 });
        await manager.update(Tarefa, tarefaAcima.id, { ordem: tarefa.ordem });
      });

      return { success: true, message: 'Tarefa movida para cima com sucesso.', data: null };
    } catch (error) {
      console.error('Erro ao mover tarefa para cima:', error);
      return { success: false, message: 'Erro ao mover tarefa para cima.', data: null };
    }
  }

  async moverParaBaixo(id: number): Promise<ApiResponseSuccess<null> | ApiResponseError> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const tarefa = await manager.findOne(Tarefa, { where: { id } });
        if (!tarefa) {
          throw new Error('Tarefa não encontrada.');
        }

        const tarefaAbaixo = await manager.findOne(Tarefa, { where: { ordem: tarefa.ordem + 1 } });
        if (!tarefaAbaixo) {
          throw new Error('Movimento inválido.');
        }

        
        await manager.update(Tarefa, tarefaAbaixo.id, { ordem: 0 }); 
        await manager.update(Tarefa, tarefa.id, { ordem: tarefa.ordem + 1 });
        await manager.update(Tarefa, tarefaAbaixo.id, { ordem: tarefa.ordem });
      });

      return { success: true, message: 'Tarefa movida para baixo com sucesso.', data: null };
    } catch (error) {
      console.error('Erro ao mover tarefa para baixo:', error);
      return { success: false, message: 'Erro ao mover tarefa para baixo.', data: null };
    }
  }
}
