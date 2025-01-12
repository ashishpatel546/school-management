import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Bus } from './bus.entity';

@Entity('bus_locations')
export class BusLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Bus, bus => bus.locations)
  bus: Bus;

  @Column('decimal', { precision: 10, scale: 6 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 6 })
  longitude: number;

  @Column({ type: 'datetime' })
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;
}
