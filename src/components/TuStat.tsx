import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

interface IProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    value: any, valClasses?: string, titleClasses?: string
}

const TuStat : FC<IProps> = ({ title, valClasses, titleClasses, value, ...props }) => {
    return (
        <div {...props} className="stat text-center m-auto">
            <span className={`stat-title ${titleClasses}`}>{title}</span>
            <span className={`stat-value ${valClasses}`}>{value}</span>
        </div>
    );
};

export default TuStat;
