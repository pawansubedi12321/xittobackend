import { GenericEntity } from "src/core/generic.entity";
import { BookingStatus } from "src/utils/enum/bookingStatus";
import { TransactionMode } from "src/utils/enum/transactionMode.enum";
import { TransactionStatus } from "src/utils/enum/transactionStatus";
import { Column, Entity, ManyToOne } from "typeorm";


@Entity('transactions')
export class Transaction extends GenericEntity{
    @Column()
    totalAmount: Number
    
    @Column()
    discountAmount: Number

    @Column({default : TransactionMode.CASH})
    transactionMode : string

    @Column({default: TransactionStatus.PENDING})
    status: string
    
    
}
