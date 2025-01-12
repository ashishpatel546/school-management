import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum FeatureType {
  COMMUNICATION = 'communication',
  LIBRARY = 'library',
  TRANSPORTATION = 'transportation',
  HOMEWORK = 'homework',
  CALENDAR = 'calendar',
  BEHAVIOR = 'behavior',
  RESOURCE_BOOKING = 'resource_booking',
  ALUMNI = 'alumni',
  NEWSLETTER = 'newsletter',
  CAFETERIA = 'cafeteria',
  HEALTH = 'health',
  CLUBS = 'clubs'
}

@Entity('features')
export class Feature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    enum: FeatureType,
    unique: true
  })
  name: FeatureType;

  @Column({ default: false })
  isEnabled: boolean;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
