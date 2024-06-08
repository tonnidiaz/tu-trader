"use client";
import { Theme } from "react-daisyui";
import "./globals.css";
import "@/src/styles/styles.scss";
import "@/src/styles/styles2.scss";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import DefaultLayout from "../layouts/Default";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <html lang="en">
            <body className="dark">
                <Provider store={store}>
                    <Theme dataTheme="dark">
                            <DefaultLayout>
                                
                                    {children}
                                    <div id="ctx-overlay"></div>
                            </DefaultLayout>
                    
                    </Theme>
                </Provider>
            </body>
        </html>
    );
}
