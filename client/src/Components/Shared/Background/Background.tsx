import "./Background.css";

interface BackgroundProps {
    sonar?: boolean;
}

export default function Background({ sonar = false }: BackgroundProps) {
    return (
        <div className="background -z-999">
            <div className="ocean-grid"></div>
            <div className="spotlight"></div>

            {sonar && (
                <div className="sonar-origin">
                    <div className="sonar-ring"></div>
                    <div className="sonar-ring"></div>
                    <div className="sonar-ring"></div>
                </div>
            )}
        </div>
    );
}
