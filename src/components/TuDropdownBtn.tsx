import NextLink from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { IDropdownMenuItem } from "../utils/interfaces";
import { sleep } from "../utils/funcs";
import { Dropdown, DropdownProps } from "react-daisyui";
import $ from "jquery";
import { useRouter } from "next/router";
import { CtxTeleport } from "../layouts/Default";
import { Root, createRoot } from "react-dom/client";

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
let theMenu : any = null
let root: Root;
let menuId: string | null

const TuDropdownBtn: React.FC<IProps> = ({ toggler, items, ...args }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const menuRef = useRef<any>();
    const testRef = useRef<HTMLDivElement>(null);

    const router = useRouter();

    
    useEffect(() => {
        document.body.addEventListener("mouseup", onDocClick);
        return () => {
            document.body.removeEventListener("mouseup", onDocClick);
        };
    }, []);


    useEffect(() => {
        setIsOpen(false);
    }, [router.pathname]);

    useEffect(()=>{
        if (!isOpen && root) {
            try{root.unmount()}catch(e){}
            }
    },[isOpen])

    const updateListener = ()=>{
        document.body.removeEventListener("mouseup", onDocClick);
        document.body.addEventListener("mouseup", onDocClick);
    }

    const onDocClick = (e: any) => {
        const menu =  document.getElementById(menuId!);
        if (menu && !menu.contains(e.target)) {
            console.log("CLOSING MENU");
            console.log(menu);
            console.log(e.target);
            setIsOpen(false);
           
            /* const par = document.querySelector("#ctx-overlay")
            if (par?.contains(theMenu))
                par?.removeChild(theMenu) */
    };
    }
   

    const menuJSX = (x?: any, y?: any)=><div
    style={{
        top: y ?? pos.y,
        left: x ?? pos.x,
        //display: isOpen ? "unset" : "none",
    }}
    className="dropdown-content menu p-2 rounded-box fixed z-[10] w-25 bg-base-200 shadow-md border-card border-1 br-6"
>
    {items.map((item, i) => (
        <li key={`item-${i*1}`}
            onClick={async (e) => {
                //console.log(e);
                const ret = await item.onTap(e);
                if (ret) {
                    setIsOpen(false);
                    $("#click-me").trigger("click");
                }
            }}
        >
            {item.child}
        </li>
    ))}
</div> 

const toggleDropdown = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        let menu : HTMLDivElement= menuRef.current
        menu = menu.firstChild as HTMLDivElement
        const size = {w: $(menu).width()!, h: $(menu).height()!}
        console.log(size);
        const { clientX, clientY } = e;
        let _pos = { x: clientX, y: clientY };
        const rightPos = clientX + size.w;
        const bottomPos = clientY + size.h;

        let deltaW = window.innerWidth - clientX;
        let deltaH = window.innerHeight - clientY;
        if (rightPos > window.innerWidth) {
            let newLeft = window.innerWidth - size.w - deltaW;
            _pos.x = newLeft;
        }

        if (bottomPos > window.innerHeight) {
            let newTop = window.innerHeight - size.h - deltaH;
            _pos.y = newTop;
        }
        setPos(_pos);
        setIsOpen(true);
        //const menuClone = menu.cloneNode(true)
        //$(menuClone).css({display: "unset", top: _pos.y, left: _pos.x})
        if (root)
            root.unmount()
       root = createRoot($("#ctx-overlay")[0])
        //theMenu = menuClone
        menuId = `menu-${Date.now()}`

        root.render( <div id={menuId}>{ menuJSX(_pos.x, _pos.y)}</div>)
        updateListener()
    };
    return (
        <div>
            <div className="toggler pointer" onClick={toggleDropdown}>
                {toggler}
            </div>
          <div style={{position: "absolute", visibility: 'hidden', display: 'block'}} className="" ref={menuRef}>{menuJSX()}</div> 
            
        </div>
    );
};

export default TuDropdownBtn;
