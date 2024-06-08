import NextLink from "next/link";
import React, { FC, useEffect, useRef, useState } from "react";
import { IDropdownMenuItem } from "../utils/interfaces";
import { sleep } from "../utils/funcs";
import { Dropdown, DropdownProps } from "react-daisyui";
import $ from "jquery";
import { useRouter, usePathname } from "next/navigation";
import { CtxTeleport } from "../layouts/Default";
import { Root, createRoot } from "react-dom/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";



interface IProps extends DropdownProps {
    toggler: React.ReactElement;
    items: IDropdownMenuItem[];
    
}
let theMenu : any = null
let root: Root;
let menuId: string | null

interface IMenuProps {x?: number, y?: number, items: IDropdownMenuItem[]; setIsOpen: (val: boolean)=> void, router: AppRouterInstance}

const MenuJSX: FC<IMenuProps> = ({x, y, items, setIsOpen, router}) => {

    const ref = useRef<HTMLUListElement>(null)


    useEffect(()=>{

        const anchors = ref.current?.querySelectorAll("a")
        anchors?.forEach(a=>{
            const href = a.href
            a.addEventListener("click", e=>{
                console.log(e.target, href);
                e.preventDefault()
                e.stopPropagation()
                router.push(href,)
            })
        })
    }, [ref.current])
    return ( <ul ref={ref}
        style={{
            top: y ?? 0,
            left: x ?? x,
            //display: isOpen ? "unset" : "none",
        }}
        className="dropdown-content menu p-2 rounded-box fixed z-[10] w-25 bg-base-200 shadow-md border-card border-1 br-6"
        >
        {items.map((item, i) => (
            <li key={`item-${i*1}`} 
                className={item.disabled ? "disabled" : ""}
                onClick={async (e) => {
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
        </ul>  );
}
 

const TuDropdownBtn: React.FC<IProps> = ({ toggler, items, ...args }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const menuRef = useRef<any>();
    const testRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const pathname = usePathname()

    
    useEffect(() => {
        document.body.addEventListener("mouseup", onDocClick);
        return () => {
            document.body.removeEventListener("mouseup", onDocClick);
        };
    }, []);


    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

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
            setIsOpen(false);
    };
    }
   

   

const toggleDropdown = (e: any) => {
    
        e.preventDefault()
        e.stopPropagation()
        let menu : HTMLDivElement= menuRef.current
        menu = menu.firstChild as HTMLDivElement
        const size = {w: $(menu).width()!, h: $(menu).height()!}
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
        root.render( <div id={menuId}><MenuJSX router={router} x={_pos.x} y={_pos.y} setIsOpen={setIsOpen} items={items}/></div>)
        updateListener()
    };
    return (
        <div>
            <div className="toggler pointer" onClick={toggleDropdown}>
                {toggler}
            </div>
          <div style={{position: "absolute", visibility: 'hidden', display: 'block'}} className="" ref={menuRef}><MenuJSX router={router} x={pos.x} y={pos.y} setIsOpen={setIsOpen} items={items}/></div> 
            
        </div>
    );
};

export default TuDropdownBtn;
