import { NextRequest } from "next/server";
import { IUser } from "../models/user";
import { Document } from "mongoose";

export interface IObj {[key: string]: any}
export interface IAddress  {

    place_name: string,
    center: [number],
    street: string,
    suburb: string,
    city: string,
    line2: string,
    state: string,
    postcode: number,
    phone: string,
    name: string,
}

export interface IRequest extends NextRequest {
    user:  Document | null
}