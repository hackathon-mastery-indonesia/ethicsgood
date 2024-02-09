import React, { createContext, useContext, useState, ReactNode } from 'react';
interface SidebarContextProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    currentPageTitle: string;
    setCurrentPageTitle: (title: string) => void;
  }
const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

interface SidebarProviderProps {
    children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentPageTitle, setCurrentPageTitle] = useState('');
  
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    return (
      <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, currentPageTitle, setCurrentPageTitle }}>
        {children}
      </SidebarContext.Provider>
    );
  };
  export const useSidebar = (): SidebarContextProps => {
    const context = useContext(SidebarContext);
    if (!context) {
      throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
  };