import { User } from "./User.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity.entity";
import { Game } from "./Game.entity";


@Entity()
export class GameHistory extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    playedDate: Date;

    @ManyToOne(type => Game, game => game.histories)
    game: Game

    @ManyToOne(type => User, user => user.gamesWon)
    winner: User
}