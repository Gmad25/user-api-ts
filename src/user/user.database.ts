import { hash } from "bcrypt";
import * as database from "../../dbManager";
import { User, UserToRegister, UserToUpdate } from "./user.model";
import { v4 as generateId } from 'uuid'
import { Database } from "db.model";

export const findAllUsers = async (): Promise<User[]> => {
    const db = await database.getDatabase();
    return db.users;
}

export const findUserById = async (id: string): Promise<User | null> => {
    const users = await findAllUsers();
    const user = users.find(user => user.id === id);
    return user ?? null;
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const users = await findAllUsers();
    const user = users.find(user => user.email === email);
    return user ?? null;
}
export const findUserByUsername = async (username: string): Promise<User | null> => {
    const users = await findAllUsers();
    const user = users.find(user => user.username === username);
    return user ?? null;
}

export const createUser = async (userToRegisterData: UserToRegister): Promise<User> => {
    const hashedPassword = await hash(userToRegisterData.password, 10);
    const userToRegister: User = {
        id: generateId(),
        ...userToRegisterData,
        password: hashedPassword
    }

    const db = await database.getDatabase();
    const updatedDb: Database = {
        ...db,
        users: [...db.users, userToRegister]
    }
    database.updateDatabase(updatedDb);
    return userToRegister;
}

export const updateUser = async(id: string, userToUpdateData: UserToUpdate): Promise<User> => {
    const user = await findUserById(id);
    if (!user) throw new Error('User not found');
    let hashedPassword = user.password;
    if (userToUpdateData.password) {
        hashedPassword = await hash(userToUpdateData.password, 10);
    }
    const updatedUser: User = {
        ...user,
        ...userToUpdateData,
        password: hashedPassword,
    }
    const db = await database.getDatabase();
    const updatedDb: Database = {
        ...db,
        users: db.users.map(user => user.id === id ? updatedUser : user)
    }
    database.updateDatabase(updatedDb);
    return updatedUser;
}


export const removeUser = async (id: string): Promise<void> => {
    const db = await database.getDatabase();
    const udpatedDb = {
        ...db,
        users: db.users.filter(user => user.id !== id),
    }
    database.updateDatabase(udpatedDb);
}