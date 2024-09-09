import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ type: 'date' })
  dueDate!: Date;

  @Column()
  priority!: string;

  @Column()
  assignedMember!: string;

  @Column({ default: 'pending' })
  status!: string;

  @Column({ type: 'date', nullable: true })
  completionDate!: Date;
}
