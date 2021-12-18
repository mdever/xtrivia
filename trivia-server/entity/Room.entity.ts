import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '.';
import { Game } from './Game.entity';
import { Ticket } from './Ticket.entity';

@Entity()
export class Room extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: string;

    @OneToMany(() => Ticket, ticket => ticket.room)
    tickets: Ticket[];

    @Column()
    name: string;

    @OneToOne(() => Game)
    @JoinColumn()
    game: Game;
}