import { api } from "@/src/utils/constants";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    try{
       const  _res = await api().get('/orders')
        res.status(200).json(_res.data)
    }catch(e){
        console.log(e);
        res.status(500).json({msg: 'Something went wrong'})
    }
}