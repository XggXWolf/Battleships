export interface ChatMessage {
  senderNickname: string;
  content: string;
  timestamp: Date;
  roomId?: string;
}
