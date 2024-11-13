import fs from 'fs'
import { Database } from './db.model';

export const getDatabase = async (): Promise<Database> => {
    const data = fs.readFileSync('./db.json', 'utf-8');
    return JSON.parse(data);
}

export const updateDatabase = async (db: Database): Promise<void> => {
    fs.writeFileSync('./db.json', JSON.stringify(db), 'utf-8');
}