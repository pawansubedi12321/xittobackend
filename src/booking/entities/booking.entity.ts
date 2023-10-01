import { GenericEntity } from "src/core/generic.entity";
import { BookingStatus } from "src/utils/enum/bookingStatus";
import { Role } from "src/utils/enum/role.enum";
import { Column, Entity, ManyToOne } from "typeorm";


@Entity('bookings')
export class Booking extends GenericEntity{

    @Column()
    brand: string
    
    @Column()
    date: string

    @Column()
    timePeriod: string
  
    @Column()
    loaction: string
        
    @Column()
    problemInterval: string

    @Column()
    description: string

    @Column({default: BookingStatus.PENDING})
    status: string
    
}
