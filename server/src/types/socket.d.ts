import { Socket } from 'socket.io';
import AppUser from './appUser';

declare module 'socket.io' {
  interface Socket {
    data: AppUser & { ready: boolean };
  }
}
