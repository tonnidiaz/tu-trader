export interface IObj {[key: string] : any}
export interface IDropdownMenuItem {
    child: React.ReactElement, onTap: (e: any)=> (Promise<boolean> | void), disabled?: boolean
}
export interface IError {msg: string, code: number}
export interface IGetData {err?: IError, data?: any}

export type TGetData = (...args: any)=> Promise<IGetData>