import { HttpStatus } from "@nestjs/common"
import { Response, response } from "express"

export class BaseController {
    successResponse<T>(response: Response, data: T, meta: any, statusCode: HttpStatus, message: string) {
        return response.status(statusCode).json({
            data,
            meta,
            statusCode,
            message,
        })
    }

    errorResponse(response: Response, statusCode: HttpStatus, message: string) {
        return response.status(statusCode).json({
            statusCode,
            message
        })
    }
}