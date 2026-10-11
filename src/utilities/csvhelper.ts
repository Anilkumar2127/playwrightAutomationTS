import { parse } from "csv-parse/sync"
import fs from 'fs'
import { logger } from "./logger";
export class CSVHelper {

    static csvReader(filePath: string): Record<string, string>[] {
        logger.info(`Reading CSV test data from ${filePath}`);
        let file: string = fs.readFileSync(filePath, 'utf-8');
        const records = parse(file,
            {
                skipEmptyLines: true,
                columns: true,
                trim: true
            }
        ) as Record<string, string>[];
        logger.info(`Read ${records.length} CSV data row(s) from ${filePath}`);
        return records;
    }

}