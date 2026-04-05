import { Injectable } from '@nestjs/common';

export type User = {
  userId: string;
  username: string;
  password: string;
  email: string;
};

//FIXME: This is just a mock. We will replace it with a real database later.
const mockUsers: User[] = [
  {
    userId: '1',
    username: 'john_doe',
    password: 'password123',
    email: 'john@mail.com',
  },
  {
    userId: '2',
    username: 'jane_doe',
    password: 'password456',
    email: 'jane@mail.com',
  },
];

@Injectable()
export class UsersService {
  async findUserByUsername(username: string): Promise<User | undefined> {
    return mockUsers.find((user) => user.username === username);
  }
}
