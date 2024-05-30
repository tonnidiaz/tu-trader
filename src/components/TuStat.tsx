import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

interface IProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    value: any
}

const TuStat : FC<IProps> = ({ title, value, ...props }) => {
    return (
        <div {...props} className="stat text-center m-auto">
            <span className="stat-title">{title}</span>
            <span className="stat-value">{value}</span>
        </div>
    );
};

export default TuStat;
