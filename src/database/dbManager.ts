import fs from 'fs'
import path from 'path'
import { Database } from './db.model';

const dbPath = path.join(__dirname, 'db.json');

export const getDatabase = async (): Promise<Database> => {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
}

export const updateDatabase = async (db: Database): Promise<void> => {
    fs.writeFileSync(dbPath, JSON.stringify(db), 'utf-8');
}