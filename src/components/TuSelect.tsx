import ReactSelect from "react-select";

const commonStyles = {
    backgroundColor:
        " var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity))) !important;",
    borderColor: "var(--fallback-bc,oklch(var(--bc)/0.2)) !important;",
    borderWidth: 1,
    borderRadius: ".5rem",
};

const TuSelect: ReactSelect = (props) => {
    return (
        <ReactSelect
        className="tu-select"
            {...props}
            styles={{
                control: (baseStyles, state) => ({
                    ...baseStyles,
                    ...commonStyles,
                    backgroundColor: 'var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity)))',
                   lineHeight: 2, paddingLeft: '.5rem',
                    
                }),
                menu: (base, props) => ({
                    ...base,
                    ...commonStyles,
                    overflow: 'hidden'
                }),
                option: (base, props) => ({
                    ...base,
                    backgroundColor: props.isFocused
                        ? "var(--fallback-p,oklch(var(--p)/.5))"
                        : "unset",
                    color: "white",
                    fontSize: 12
                }),
                placeholder:(base, props)=> ({
                    ...base,
                }),
                singleValue: (base, props) =>( {
                    ...base, color: 'currentColor',  fontSize: 12
                }),
                menuList: (base, props) =>({
                    ...base,  maxHeight: 150,
                })
            }}
        />
    );
};

export default TuSelect;
