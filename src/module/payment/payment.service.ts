import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma.service';

@Injectable()
export class PaymentService {

    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createWebhook(body: any) {
        try {
            const data = await this.prisma.payment.update({
                where: {
                    payment_id: body.order_id
                },
                data: {
                    meta: body,
                    status: body.transaction_status
                }
            })
        } catch(error) {
            if (error instanceof NotFoundException) {
                throw error
            }
            throw new InternalServerErrorException
        }
    }
}
