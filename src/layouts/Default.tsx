import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DefaultLayout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => { 
    return ( <> <Navbar></Navbar>
    <div className="tu-app">
        <Sidebar></Sidebar>
        <main>{children}</main>
    </div></> );
}
 
export default DefaultLayout;