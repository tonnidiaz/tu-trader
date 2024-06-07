export interface IObj {[key: string] : any}
export interface IDropdownMenuItem {
    child: React.ReactElement, onTap: (e: any)=> (Promise<boolean> | void), disabled?: boolean
}
