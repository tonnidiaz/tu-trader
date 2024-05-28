import NextLink from "next/link";
import React, { useState } from "react";
import { IDropdownMenuItem } from "../utils/interfaces";
import { sleep } from "../utils/funcs";

const testItems: IDropdownMenuItem[] = [
    {
        onTap: async () => {
            console.log("ITEM 1 TAPPED");
            await sleep(1000);
            return true;
        },
        child: <span>Hello</span>,
    },
    {
        onTap: async () => {
            console.log("ITEM 2 TAPPED");
            await sleep(2000);
            return true;
        },
        child: <span className="text-primary fw-6">From the other side</span>,
    },
];

const TuDropdownBtn = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={"dropdown " + (isOpen ? "dropdown-open" : "dropdown-closed")}>
            <label
                onClick={(_) => setIsOpen(!isOpen)}
                tabIndex={0}
                className="btn btn-ghost btn-circle"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h7"
                    />
                </svg>
            </label>
            <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-md border-1 border-card bg-base-100 rounded-box w-52 open"
            >
                {testItems.map((e, i) => (
                    <li onClick={async()=>{
                        const close = await e.onTap()
                        if (close){
                            setIsOpen(false)
                        }
                    }}>{e.child}</li>
                ))}
            </ul>
        </div>
    );
};

export default TuDropdownBtn;
