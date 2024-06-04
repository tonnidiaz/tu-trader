import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

interface IProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    value: any, valClasses?: string
}

const TuStat : FC<IProps> = ({ title, valClasses, value, ...props }) => {
    return (
        <div {...props} className="stat text-center m-auto">
            <span className="stat-title">{title}</span>
            <span className={`stat-value ${valClasses}`}>{value}</span>
        </div>
    );
};

export default TuStat;
