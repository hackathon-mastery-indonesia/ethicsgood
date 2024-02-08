import React from "react";
import Sidebar, { ArticleSidebar } from "../component/Sidebar/Sidebar";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { HiMenu } from 'react-icons/hi';

const SidebarWrapper: React.FC<{ children: React.ReactNode, sidebar: React.ReactNode }> = ({ children, sidebar }) => {
    const { isSidebarOpen, toggleSidebar, currentPageTitle, setCurrentPageTitle } = useSidebar();
    return (
        <div className="flex min-h-screen max-h-screen">
        <div className="fixed top-2 left-2 z-20">
            <div onClick={()=>{
                toggleSidebar()
            }} className="md:hidden p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xl items-center justify-center">
                <HiMenu/>
            </div>
        </div>
        <div className={`fixed top-0 left-0 z-20 md:relative   transition-all duration-300 ${isSidebarOpen? 'flex w-[20%] translate-x-0 min-w-[18rem]' : ' -translate-x-[24rem] md:translate-x-0 flex md:w-[4rem]' }   h-screen`}>
            {sidebar}
        </div>
        <div className="grow overflow-y-auto">
          {children}
        </div>
      </div>
    
    );
 };

 const SidebarLayout : React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <SidebarProvider>
        <SidebarWrapper sidebar={<Sidebar/>}>
            {children}
        </SidebarWrapper>
    </SidebarProvider>
 }
 const ArticleSidebarLayout : React.FC<{ children: React.ReactNode, onSidebarChange: (title:string) => void }> = ({ children, onSidebarChange }) => {
    return <SidebarProvider>
        <SidebarWrapper sidebar={<ArticleSidebar onSidebarChange={onSidebarChange}/>}>
            {children}
        </SidebarWrapper>
    </SidebarProvider>
 }

 export {ArticleSidebarLayout}
 export default SidebarLayout
