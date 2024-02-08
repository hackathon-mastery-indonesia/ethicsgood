import React, { useEffect } from 'react';
import { useSidebar } from '../../context/SidebarContext';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { RiHome2Fill, RiSearch2Fill, RiBookFill, RiRobot2Fill, RiFileList2Fill, RiHeart2Fill, RiChatCheckFill, RiSearch2Line, RiRobot2Line } from 'react-icons/ri';
import { useRouter, usePathname } from 'next/navigation';
import { MdArticle, MdBook, MdPeople, MdPerson, MdQuiz, MdVideocam } from 'react-icons/md';
import { AiOutlineRobot } from 'react-icons/ai';
import { BiBookReader } from 'react-icons/bi';

type SidebarContent = {
    title: string,
    href: string,
    icon: React.ReactNode
}
type ArticleSidebarProps = {
    onSidebarChange: (title:string) => void
}

const ArticleSidebar: React.FC<ArticleSidebarProps> = ({onSidebarChange}) => {
    const { isSidebarOpen, toggleSidebar, currentPageTitle, setCurrentPageTitle } = useSidebar();
    useEffect(()=>{
        setCurrentPageTitle('Konten')
    },[])
    const content: Array<SidebarContent> = [
        {
            title: 'Content',
            href:'#',
            icon:  <BiBookReader title='Content'/>
        },
        {
            title: 'Assesment',
            href:'#',
            icon: <MdArticle title='Assesment'/>
        },
    ]
    const handleNavigation = (title: string, path: string) => {
        setCurrentPageTitle(title);
        onSidebarChange(title) 
      };
    return (
        <div className=' w-full h-full max-h-screen bg-blue-600 flex flex-col p-4'>
  
          <div className={`flex w-full ${isSidebarOpen? 'justify-between': 'justify-center'} items-center mb-4`}>
          {
              isSidebarOpen && <a href='/' className=' text-white text-xl md:text-3xl font-bold whitespace-break-spaces break-words'>EthicsGood</a>
          }
          <div onClick={toggleSidebar} className='ml-2 text-white text-lg'>
              {
                  isSidebarOpen? <FaChevronLeft/> : <FaChevronRight/>
              }
          </div>
         
          </div>  
          <hr className='w-full border-gray-200 border rounded-full mb-4' />
  
          <div className='sidebar-content flex flex-col space-y-4 grow '>
              {
                 isSidebarOpen &&  content.map((data)=>{
                      return <div onClick={()=>{
                          handleNavigation(data.title,data.href)
                      }} key={`data-${data.title}-sidebar-content`} className={`flex items-center w-full rounded-full py-2 px-4 ${currentPageTitle == data.title? 'bg-blue-500': ''}`}>
                          <div className='mr-2 text-white text-xl'>
                              {data.icon}
                          </div>
                          <h1 className='text-left text-sm md:text-base text-white whitespace-break-spaces break-words'>{data.title}</h1>
                      </div>
                  })
              }
              {
                  !isSidebarOpen &&  content.map((data)=>{
                      return <div onClick={()=>{
                          handleNavigation(data.title,data.href)
                      }} key={`data-${data.title}-sidebar-content-hidden`} className={`flex items-center justify-center w-full rounded-full py-2 px-4 ${currentPageTitle == data.title? 'bg-blue-500': ''}`}>
                          <div className=' text-white text-xl'>
                              {data.icon}
                          </div>
                          
                      </div>
                  })
              }
          </div>
        </div>
      );

} 
const Sidebar: React.FC = () => {
    const { isSidebarOpen, toggleSidebar, currentPageTitle, setCurrentPageTitle } = useSidebar();
    const path = usePathname()
    const router = useRouter()
    useEffect(() => {
        // Mendapatkan path dari URL dan memperbarui judul halaman
        const matchedContent = content.find((item) => item.href === path);
        if (matchedContent) {
          setCurrentPageTitle(matchedContent.title);
          //toggleSidebar()
        }
      }, [path, setCurrentPageTitle]);

    const content: Array<SidebarContent> = [
        {
            title: 'Home',
            href: '/',
            icon: <RiHome2Fill title='Home' />
        },
        {
            title: 'Prompt',
            href: '/prompt',
            icon: <RiRobot2Line title='prompt' />
        },
        {
            title: 'Ethics Module',
            href: '/ethics-module',
            icon: <RiBookFill title='Ethics Module' />
        },
     ];
  
    const handleNavigation = (title: string, path: string) => {
      if(title != currentPageTitle){
        router.push(path)
      }
      setCurrentPageTitle(title);
      
    };
  
    return (
      <div className=' w-full h-full max-h-screen bg-blue-600 flex flex-col p-4'>

        <div className={`flex w-full ${isSidebarOpen? 'justify-between': 'justify-center'} items-center mb-4`}>
        {
            isSidebarOpen && <h1 className=' text-white text-xl md:text-3xl font-bold whitespace-break-spaces break-words'>EthicsGood</h1>
        }
        <div onClick={toggleSidebar} className='ml-2 text-white text-lg'>
            {
                isSidebarOpen? <FaChevronLeft/> : <FaChevronRight/>
            }
        </div>
       
        </div>  
        <hr className='w-full border-gray-200 border rounded-full mb-4' />

        <div className='sidebar-content flex flex-col space-y-4 grow '>
            {
               isSidebarOpen &&  content.map((data)=>{
                    return <div onClick={()=>{
                        handleNavigation(data.title,data.href)
                    }} key={`data-${data.title}-sidebar-content`} className={`flex items-center w-full rounded-full py-2 px-4 ${currentPageTitle == data.title? 'bg-blue-500': ''}`}>
                        <div className='mr-2 text-white text-xl'>
                            {data.icon}
                        </div>
                        <h1 className='text-left text-sm md:text-base text-white whitespace-break-spaces break-words'>{data.title}</h1>
                    </div>
                })
            }
            {
                !isSidebarOpen &&  content.map((data)=>{
                    return <div onClick={()=>{
                        handleNavigation(data.title,data.href)
                    }} key={`data-${data.title}-sidebar-content-hidden`} className={`flex items-center justify-center w-full rounded-full py-2 px-4 ${currentPageTitle == data.title? 'bg-blue-500': ''}`}>
                        <div className=' text-white text-xl'>
                            {data.icon}
                        </div>
                        
                    </div>
                })
            }
        </div>
      </div>
    );
  };

//const ArticleSidebar: React
  export {ArticleSidebar}
  export default Sidebar;