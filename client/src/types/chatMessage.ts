export interface ChatMessage {
    uuid: string;
    type: "system" | "player" | "opponent";
    senderNickname: string;
    content: string;
    timestamp: Date;
}
