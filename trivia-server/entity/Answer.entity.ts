import { Entity, ManyToOne, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Question } from './Question.entity';

@Entity({
    name: 'answers'
})
export class Answer extends BaseEntity {

    @Column()
    text: string;

    @Column()
    index: number;

    @Column()
    correct: boolean

    @ManyToOne(type => Question, question => question.answers, {
        cascade: ['insert', 'update']
    })
    question: Question;
}