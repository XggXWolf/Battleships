import "./MiscInfo.css";

interface MiscInfoProps {
    text: string;
    svg: string;
    onClick?: () => void;
}

export default function MiscInfo({ text, svg, onClick }: MiscInfoProps) {
    return (
        <div
            className={`info-badge flex items-center gap-1 
                ${
                    onClick &&
                    `
                    cursor-pointer transition-all duration-200 
                    hover:brightness-125 hover:scale-105 
                    hover:shadow-[0_0_15px_rgba(96,165,250,0.15)]
                `
                }`}
            onClick={onClick}
        >
            <img src={svg} alt="text" className="w-3 h-3 text-white" />
            {text}
        </div>
    );
}
