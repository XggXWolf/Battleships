export interface ChatMessage {
  senderSocket: string;
  senderNickname: string;
  content: string;
  timestamp: Date;
}
