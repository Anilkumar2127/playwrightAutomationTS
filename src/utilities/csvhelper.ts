import { parse } from "csv-parse/sync"
import fs from 'fs'
export class CSVHelper {

    static csvReader(filePath: string): Record<string, string>[] {
        let file: string = fs.readFileSync(filePath, 'utf-8');
        return parse(file,
            {
                skipEmptyLines: true,
                columns: true,
                trim: true
            }
        ) as Record<string, string>[];
    }

}