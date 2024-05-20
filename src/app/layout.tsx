'use client'
import { Theme } from "react-daisyui";
import type { Metadata } from "next";
import './globals.css'
import '@/src/styles/styles.scss'
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Head from "next/head";
import { SITE } from "../utils/constants";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 
  return (
    <html lang="en">
        <head><title>{SITE} - A trading bot from Tunedbass</title></head>
        
      <body className='dark'>
        <Theme dataTheme="dark">
            <Navbar></Navbar>
            <div className="tu-app">
                <Sidebar></Sidebar>
                <main>{children}</main>
            </div>
            </Theme></body>
    </html>
  );
}
