import React from "react";
import { SITE } from "../utils/constants";

const Layout2 = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
      
            <div className="h-100vh tu-app">
                <main className="h-100p w-100p flex flex-col items-center justify-center">{children}</main>
            </div>
           
        </>
    );
};

export default Layout2;
