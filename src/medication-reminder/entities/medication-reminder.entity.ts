import { User } from 'src/users/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  Entity,
} from 'typeorm';

@Entity('reminders')
export class MedicationReminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  medication_brand_name: string;

  @Column({ type: 'varchar', nullable: true })
  medication_strength: string;

  @Column({ type: 'varchar', nullable: true })
  condition: string;

  @Column({ type: 'varchar', nullable: true })
  frequency: string;

  @Column({ type: 'varchar', nullable: true })
  medication_type: string;

  @Column({ type: 'varchar', nullable: true })
  duration: string;

  @Column({ type: 'varchar', nullable: true })
  quantity: string;

  @Column({ type: 'varchar', nullable: true })
  start_date: string;

  @Column({ type: 'varchar', nullable: true })
  end_date: string;

  @Column({ type: 'simple-array' })
  specified_alarm_times: string[];

  @Column({ type: 'int', nullable: true })
  dosage: number;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @DeleteDateColumn()
  deleted_at: string;
}
