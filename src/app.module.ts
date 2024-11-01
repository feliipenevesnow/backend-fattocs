import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarefasModule } from './tarefas/tarefas.module';
import { Tarefa } from './tarefas/entities/tarefa.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', 
      database: 'database.sqlite', 
      entities: [Tarefa], 
      synchronize: true, 
    }),
    TarefasModule,
  ],
})
export class AppModule {}
