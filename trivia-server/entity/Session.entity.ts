import { User } from '.';
import { Entity, OneToOne, JoinColumn, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';

@Entity({name: 'sessions'})
export class Session extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    expiresAt: Date;

    @OneToOne(() => User, { eager: true })
    @JoinColumn()
    user: User;
}