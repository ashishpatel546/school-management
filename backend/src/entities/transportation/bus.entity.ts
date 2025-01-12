import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BusRoute } from './bus-route.entity';
import { BusLocation } from './bus-location.entity';

@Entity('buses')
export class Bus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: string;

  @Column()
  capacity: number;

  @Column()
  driverName: string;

  @Column({ nullable: true })
  driverContact: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => BusRoute, route => route.bus)
  routes: BusRoute[];

  @OneToMany(() => BusLocation, location => location.bus)
  locations: BusLocation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
