import "./GameGrid.css";

interface GridButtonProps {
    coordinates: { row: number; col: number };
    onClick?: () => void;
    isClicked?: boolean;
}

const numberToLetter = (num: number) => String.fromCharCode(65 + num);

export default function GridButton({
    coordinates,
    onClick,
    isClicked,
}: GridButtonProps) {
    return (
        <button
            className={`grid-cell ${isClicked ? "bg-green-500/30" : "bg-blue-900/30 hover:bg-blue-800/50 active:bg-blue-700/70 transition"}  rounded-sm border border-blue-900 `}
            onClick={onClick}
        >
            <div className="grid-cell-content text-gray-400">{`${numberToLetter(coordinates.col)}${coordinates.row + 1}`}</div>
        </button>
    );
}
