import { useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { api } from "../utils/constants";
import { useEffect } from "react";
import { setUser } from "../redux/reducers/user";

const DefaultLayout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => { 

    const dispatch = useDispatch()

    useEffect(()=>{
        getUser()
    }, [])
    const getUser = async () => { 
        try{
            console.log("GETTING USER");
            const res = await api(true).post('/auth/login', {})
            dispatch(setUser(res.data.user))
        }
        catch(e){
            console.log(e);
        }
     }
    return ( <> <Navbar></Navbar>
    <div className="tu-app">
        <Sidebar></Sidebar>
        <main>{children}</main>
    </div></> );
}
 
export default DefaultLayout;