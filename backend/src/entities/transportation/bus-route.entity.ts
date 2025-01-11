import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Bus } from './bus.entity';
import { BusStop } from './bus-stop.entity';

@Entity('bus_routes')
export class BusRoute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @ManyToOne(() => Bus, bus => bus.routes)
  bus: Bus;

  @OneToMany(() => BusStop, stop => stop.route)
  stops: BusStop[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
