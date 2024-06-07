import { Body, Controller, Post, Res } from '@nestjs/common';
import { BaseController } from 'src/core/base.controller';
import { PaymentService } from './payment.service';
import { Response } from 'express';

@Controller('payment')
export class PaymentController extends BaseController {
    constructor(
        private readonly paymentService: PaymentService,
    ) {
        super()
    }

    @Post()
    async payemntWebhook(
        @Body() body: any,
        @Res() response: Response
    ) {
        try {
            const data = await this.paymentService.createWebhook(body)
            return this.successResponse(
                response,
                data,
                null,
                200,
                'Success update payment'
            );
        }catch(error) {
            this.errorResponse(
                response,
                error.response.statusCode,
                error.response.message
            )
        }
    }
}
