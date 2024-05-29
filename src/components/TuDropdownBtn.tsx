import NextLink from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { IDropdownMenuItem } from "../utils/interfaces";
import { sleep } from "../utils/funcs";
import { Dropdown, DropdownProps } from "react-daisyui";
import $ from "jquery";
import { useRouter } from "next/router";

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

interface IProps extends DropdownProps {
    toggler: React.ReactElement;
    items: IDropdownMenuItem[];
}

const TuDropdownBtn: React.FC<IProps> = ({ toggler, items, ...args }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const menuRef = useRef<any>();
    const menuPareentRef = useRef<any>();

    const router = useRouter();

    useEffect(() => {
        document.addEventListener("click", onDocClick);
        return () => {
            document.removeEventListener("click", onDocClick);
        };
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [router.pathname]);
    const onDocClick = (e: any) => {
        if (!menuPareentRef.current.contains(e.target)) setIsOpen(false);
    };
    const toggleDropdown = (e: any) => {
        console.log(e);
        const menu = menuRef.current;
        const { clientX, clientY } = e;
        let _pos = { x: clientX, y: clientY };

        const menuWidth = $(menu).width()!,
            menuHeight = menu.clientHeight;
        const rightPos = clientX + menuWidth;
        const bottomPos = clientY + menuHeight;

        let deltaW = window.innerWidth - clientX;
        let deltaH = window.innerHeight - clientY;
        if (rightPos > window.innerWidth) {
            let newLeft = window.innerWidth - menuWidth - deltaW;
            _pos.x = newLeft;
        }

        if (bottomPos > window.innerHeight) {
            let newTop = window.innerHeight - menuHeight - deltaH;
            _pos.y = newTop;
        }
        setPos(_pos);
        setIsOpen(true);
    };
    return (
        <div ref={menuPareentRef}>
            <div className="toggler pointer" onClick={toggleDropdown}>
                {toggler}
            </div>
            <div
                ref={menuRef}
                style={{
                    top: pos.y,
                    left: pos.x,
                    display: isOpen ? "unset" : "none",
                }}
                className="dropdown-content menu p-2 rounded-box fixed z-[10] w-25 bg-base-200 shadow-md border-card border-1 br-6"
            >
                {items.map((item, i) => (
                    <Dropdown.Item
                        onClick={async (e) => {
                            const ret = await item.onTap();
                            if (ret) {
                                setIsOpen(false);
                                $("#click-me").trigger("click");
                            }
                        }}
                    >
                        {item.child}
                    </Dropdown.Item>
                ))}
            </div>
        </div>
    );
};

export default TuDropdownBtn;
