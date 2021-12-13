import { Entity, OneToMany, ManyToOne, Column } from 'typeorm';
import { User } from './User';
import { BaseEntity } from './BaseEntity';
import { Question } from './Question';

@Entity({name: 'games'})
export class Game extends BaseEntity {

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