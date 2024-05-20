import React from "react";

const TuForm = ({
    onSubmit,
    children,
}: {
    onSubmit: Function;
    children: React.ReactNode;
}) => {
    const handleSubmit = async (e: any) => {
        console.log("ON SUBMIT");
        e.preventDefault();
        const btns = [...e.target.querySelectorAll("button[type=submit]")];
        btns.forEach((btn: any) => {
            btn.disabled = true;
        });
        if (onSubmit) {
            await onSubmit(e);
        }
        btns.forEach((btn: any) => (btn.disabled = false));
    };
    return (
        <form action="#" onSubmit={handleSubmit}>
            {children}
        </form>
    );
};

export default TuForm;
