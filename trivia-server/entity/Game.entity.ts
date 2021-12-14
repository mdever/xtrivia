import { Entity, OneToMany, ManyToOne, Column, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User.entity';
import { BaseEntity } from './BaseEntity.entity';
import { Question } from './Question.entity';

@Entity({name: 'games'})
export class Game extends BaseEntity {

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

}