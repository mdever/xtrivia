import { Entity, Column, OneToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Answer } from './Answer.entity';
import { BaseEntity } from './BaseEntity.entity';
import { Game } from './Game.entity';

@Entity({
    name: 'questions'
})
export class Question extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column({
        nullable: true
    })
    hint?: string;
    
    @Column()
    index: number;

    @OneToMany(type => Answer, answer => answer.question, {
        cascade: true
    })
    answers: Answer[];

    @ManyToOne(type => Game, game => game.questions, {
        onDelete: 'CASCADE'
    })
    game: Game;
}