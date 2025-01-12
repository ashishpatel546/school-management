import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { FeatureGuard } from '../feature/guards/feature.guard';
import { RequireFeature } from '../feature/decorators/feature.decorator';
import { FeatureType } from '../../entities/feature.entity';
import { CommunicationService } from './communication.service';
import { wsAuthMiddleware, SocketWithAuth } from './middleware/ws-auth.middleware';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(JwtAuthGuard, RolesGuard, FeatureGuard)
@RequireFeature(FeatureType.COMMUNICATION)
export class CommunicationGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly communicationService: CommunicationService,
    private readonly jwtService: JwtService,
  ) {
    this.server.use(wsAuthMiddleware(jwtService));
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { recipientId: string; content: string },
  ) {
    try {
      const user = (client as any).user;
      const message = await this.communicationService.createMessage(user.sub, {
        receiverId: payload.recipientId,
        content: payload.content,
      });

      // Emit to recipient
      this.server.to(payload.recipientId).emit('newMessage', message);
      
      return message;
    } catch (error) {
      client.emit('error', { message: error instanceof Error ? error.message : 'An error occurred' });
      throw new WsException('Failed to send message');
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    client.join(roomId);
    return { success: true };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    client.leave(roomId);
    return { success: true };
  }

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
