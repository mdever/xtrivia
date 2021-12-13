import { User as UserDTO } from 'trivia-shared';
import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Game } from './Game';

@Entity({name: 'users'})
export class User extends BaseEntity {

    @Column()
    username: string;

    @Column()
    email: string;

    @OneToMany(type => Game, game => game.owner, {
        cascade: true
    })
    games: Game[];
}