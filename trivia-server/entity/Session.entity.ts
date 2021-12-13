import { User } from '.';
import { Entity, OneToOne, JoinColumn, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';

@Entity({name: 'sessions'})
export class Session extends BaseEntity {
    
    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column()
    token: string;

    @Column()
    expiresAt: Date;
}