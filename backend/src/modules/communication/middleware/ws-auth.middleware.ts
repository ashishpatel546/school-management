import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

export type SocketWithAuth = Socket & { user: any };

export const wsAuthMiddleware = (jwtService: JwtService) => {
  return (client: Socket, next: (err?: Error) => void) => {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        throw new WsException('Unauthorized');
      }

      const payload = jwtService.verify(token);
      (client as SocketWithAuth).user = payload;
      
      next();
    } catch (error) {
      next(new Error('Unauthorized'));
    }
  };
};
