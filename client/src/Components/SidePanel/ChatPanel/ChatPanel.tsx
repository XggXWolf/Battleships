interface ChatPanelProps {
    hidden: boolean;
}

export default function ChatPanel({ hidden }: ChatPanelProps) {
    return (
        <div
            className={`${hidden ? "hidden" : "block"} flex flex-col space-y-4 h-full`}
        >
            {hidden ? "ChatPanel (Hidden)" : "ChatPanel (Visible)"}
        </div>
    );
}
