import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';
import { GenericEntity } from '../../utils/generic.entity';

@Entity()
export class Service extends GenericEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,

    })
    title: string;

    @Column({
        nullable: false,
    })
    status: boolean;

    @Column({
        nullable: true,
    })
    description: string;

    @Column({
        nullable: true,
    })
    image_url: string;




}
