import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tarefas')
export class Tarefa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  custo: number;

  @Column({ type: 'date' })
  dataLimite: Date;

  @Column({ type: 'int', unique: true })
  ordem: number;
}
