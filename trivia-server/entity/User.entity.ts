import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Game } from './Game.entity';
import { GameHistory } from './GameHistory.entity';
import { Session } from './Session.entity';

@Entity({name: 'users'})
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @OneToMany(type => Game, game => game.owner, {
        cascade: true
    })
    games: Promise<Game[]>;

    @Column()
    pwHash: string;

    @Column()
    salt: string;

    @OneToMany(type => GameHistory, history => history.winner)
    gamesWon: GameHistory[];
}