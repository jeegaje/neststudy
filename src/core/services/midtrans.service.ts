import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Rental, User } from '@prisma/client'
import * as MidtransClient from 'midtrans-client'
import { v4  as uuidv4 } from 'uuid'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MidtransService {
    private coreApi

    constructor(private readonly config: ConfigService) {
        this.coreApi = new MidtransClient.CoreApi({
            isProduction : false,
            serverKey : config.get('MIDTRANS_SERVER_KEY'),
            clientKey : config.get('MIDTRANS_CLIENT_KEY'),
        })
    }

    async createMandiriCharge(rental: Rental, user: Partial<User>){
        const body = {
            "payment_type": "echannel",
            "transaction_details": {
                "gross_amount": rental.rent_cost,
                "order_id": `order-${rental.id}-${uuidv4()}`
            },
            "echannel" : {
                "bill_info1" : "Payment For:",
                "bill_info2" : "Rental"
            }
        }

        try {
            const transaction = this.coreApi.charge(body)
            return transaction
        } catch(error) {
            throw new InternalServerErrorException(error.message)
        }
    }
}