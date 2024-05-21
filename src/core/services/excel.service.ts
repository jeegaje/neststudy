import { BadRequestException, Injectable } from "@nestjs/common"
import { ClassConstructor, plainToClass, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { error } from "console";
import { CellValue, Workbook, Worksheet } from "exceljs"
import { Response } from "express";
import * as path from "path";
import { CreateCarDto } from "src/module/cars/dto/create-car.dto";
import { Car } from "src/module/cars/entities/car.entity";


@Injectable()
export class ExcelService {
    private workbook: Workbook
    private filePath: string

    constructor() {
        this.workbook = new Workbook
    }

    setFilePath(filename: string) {
        this.filePath = path.resolve(`./uploads/${filename}`)
        return this
    }

    async validateDataWithDto<T extends object>(
        dto: ClassConstructor<T>, 
        data: T[]
    ) {
        const converted: T[] = plainToInstance(dto, data)
        const errors = await Promise.all(converted.map(car => validate(car)));
        const invalid = errors.filter(e => e.length > 0);
        if (invalid.length > 0) {
            throw new BadRequestException(invalid);
        }
    }

    async generateExcelFile<T>(
        data: T[],
        worksheetName: string,
        response: Response
    ) {
        const workbook = new  Workbook
        const worksheet = workbook.addWorksheet(worksheetName)

        worksheet.columns = Object.keys(data[0]).map(key => ({ header: key.toUpperCase(), key }));
       
        data.forEach((val,i,_) => {
            worksheet.addRow(val)
        })

        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader("Content-Disposition", "attachment; filename=" + 'test.xlsx');
    
        workbook.xlsx.write(response).then(function(){
            response.end();
        });
    
    }

    async buildToJsonWithDto<T extends object>(
        dto: ClassConstructor<T>
    ) {
        await this.workbook.xlsx.readFile(this.filePath);

        let dataJson: T[] = []
        this.workbook.worksheets.forEach((sheet) => {
          const keys: string[] = sheet.getRow(1).values as string[]

          sheet.eachRow((row, rowNumber) => {
            if (rowNumber == 1) return
            let obj: any = {}
            for (let i = 1; i < keys.length; i++) {
                obj[keys[i]] = row.values[i]
            }
            dataJson.push(obj)
          })
        })

        await this.validateDataWithDto(dto, dataJson)

        return dataJson
    }
}