import { FC, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    hint: string;
}
const TuField: FC<Props> = ({ hint = "", ...props }) => {
    return (
        <input
            className="input input-bordered w-full"
            placeholder={hint}
            {...props}
        />
    );
};

export default TuField;
