import { Entity, Column, OneToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Answer } from './Answer.entity';
import { BaseEntity } from './BaseEntity.entity';
import { Game } from './Game.entity';

@Entity({
    name: 'games'
})
export class Question extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

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