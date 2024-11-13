export type User = {
    id: string
    username: string
    email: string
    password: string
};

export type UserToRegister = Omit<User, 'id'>;
export type UserToUpdate = Partial<UserToRegister>;




