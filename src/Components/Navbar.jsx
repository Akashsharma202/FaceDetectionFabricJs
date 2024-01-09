import React from "react";
import logo from "./logo.png";
export const Navbar = () => {
    return (
        <nav className="bg-slate-200 border-black-900 ">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={logo} className="h-8" alt="Flowbite Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap">QuickReel</span>
                </a>
            </div>
        </nav>
    )
}