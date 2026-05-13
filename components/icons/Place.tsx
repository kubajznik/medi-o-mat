interface PlaceProps {
    index: number;
    className?: string;
}

export default function Place({ index, className }: PlaceProps) {

    if (index < 0 || index > 2) {
        return null; // Return null for invalid index values
    }

    const imageSource = index === 0 ? 
        "/images/1_platz.png" :
        index === 1 ? 
        "/images/2_platz.png" :
        "/images/3_platz.png";

    const altText = index === 0 ? 
        "Erster Platz" :
        index === 1 ? 
        "Zweiter Platz" :
        "Dritter Platz";

    return (
        <div className={`absolute z-10 top-0 -left-3 w-16 h-16 rounded-full flex items-center justify-center ${className}`}>
            <img src={imageSource} alt={altText} />
        </div>
    )
}