import { Entity, Column, OneToMany, ManyToOne, OneToOne } from 'typeorm';
import { Answer } from './Answer';
import { BaseEntity } from './BaseEntity';
import { Game } from './Game';

@Entity()
export class Question extends BaseEntity {

    @Column()
    text: string;

    @Column()
    hint?: string;
    
    @Column()
    index: number;

    @OneToMany(type => Answer, answer => answer.question, {
        cascade: true
    })
    answers: Answer[];

    @ManyToOne(type => Game, game => game.questions, {
        cascade: ['insert', 'update']
    })
    game: Game;
}