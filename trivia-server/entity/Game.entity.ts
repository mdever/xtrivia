import { Entity, OneToMany, ManyToOne, Column, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User.entity';
import { BaseEntity } from './BaseEntity.entity';
import { Question } from './Question.entity';
import { GameHistory } from './GameHistory.entity';

@Entity({name: 'games'})
export class Game extends BaseEntity {

    static toDTO(game: Game): object {
        let tempGame: any = {
            ...game
        };

        let { owner, ...cleanGame } = tempGame;
        

        cleanGame['ownerId'] = game.owner.id;

        return JSON.parse(JSON.stringify(cleanGame));
    }

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.games, {
        cascade: ['insert', 'update']
    })
    owner: User;

    @Column()
    name: string;

    @OneToMany(type => Question, question => question.game, {
        cascade: true
    })
    questions: Question[];

    @OneToMany(type => GameHistory, history => history.game)
    histories: GameHistory[];
}