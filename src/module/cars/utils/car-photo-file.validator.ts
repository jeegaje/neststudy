import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from "@nestjs/common";

export class CarPhotoFileValidator extends ParseFilePipe {
    constructor() {
        super({
            validators: [
                new MaxFileSizeValidator({ maxSize: 1000000 }), // Max size in bytes
                new FileTypeValidator({ fileType: 'image/jpeg' }),
            ],
            fileIsRequired: false
        })
    }
}