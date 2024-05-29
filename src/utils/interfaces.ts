export interface IObj {[key: string] : any}
export interface IDropdownMenuItem {
    child: React.ReactElement, onTap: ()=> (Promise<boolean> | void)
}
