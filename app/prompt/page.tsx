'use client'
import { useRef, useState } from "react";
import Toggle from "../component/Toggle/Toggle"
import SidebarLayout from "../layout/SidebarLayout"
import axios from "axios";
import { useRouter } from "next/navigation";
import Loading from "../component/Loading/LoadingIcon";


function SearchPage(){
    const [selectedToggle, setSelectedToggle] = useState<string>('Issue');
    const textRef = useRef<HTMLTextAreaElement>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
  const handleToggleChange = (option: string) => {
    setSelectedToggle(option);
    // Lakukan sesuatu dengan opsi yang dipilih, misalnya tampilkan konten terkait
  };
    return (
        <main className="flex min-h-screen overflow-y-auto w-full flex-col items-center justify-start  pt-12 pb-10 bg-white px-4">
          {loading && <Loading/>}
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
      </div>
      <div className="w-full flex flex-col max-w-3xl mx-auto">
      <div className="flex flex-col w-full mx-auto ">
          <h1 className="text-black text-3xl font-bold text-left mb-4">Prompting to Explore Recommended Ethics Guides <span className="text-blue-500">You Wish For</span></h1>
          
          <textarea
          ref={textRef}
          maxLength={300}
          className="w-full p-4 border-4 text-black rounded-md min-h-48 focus:outline-none  focus:border-blue-400 border-blue-300"
          placeholder="Type the ethic or etiquette issues, situations, topics, or questions about everyday health you'd like to explore..."
    />
          
          <div className="flex w-full  items-center justify-end">
          <button onClick={async ()=>{
            if(textRef.current){
                if(textRef.current.value.trim() == ''){
                    alert('Prompt that you are entered is empty.')
                }
                else{
                    setLoading(true)
                    try {
                      const res = await axios.post('/api/health/create', {
                        'prompt': textRef.current.value
                      })
                      const resData = res.data
                      const url = resData.url
                      router.push(url)
                      setLoading(false)
                    } catch (error) {
                      setLoading(false)
                      console.log(error)
                    }
                }
            }
          }} className="flex items-center md:min-w-36 w-full md:w-min justify-center px-2 py-2 mt-4 rounded-md
           text-white font-bold bg-blue-500 hover:bg-blue-700 text-center"><h1>Search</h1></button>
          </div>
      </div>
      <div className="w-full flex flex-col mt-8">
            <h1 className=" text-left text-3xl font-bold text-black mb-4">
              <span className="text-vlue-500">Prompt </span>Example
            </h1>
            <div className="flex flex-col w-full">
            <Toggle
            options={['Issue', 'Topic', 'Situation', 'Question']}
            onChange={handleToggleChange}
            defaultOption="Issue"
            />
            <textarea
          maxLength={300}
          readOnly
          className="w-full p-4 border-4 mt-4 text-black rounded-md min-h-48 border-gray-300"
          value={selectedToggle == 'Issue'? `I saw a viral video on social media where some students playfully hid their teacher's car keys and laughed at the teacher. What ethics should I follow as a student?` : 
          selectedToggle == 'Topic' ? 
          `The current viral trend among some Gen Zs about ethics is quite amusing. Could you explain to me why such ethics should be avoided?`: 
          selectedToggle == 'Situation'? 'How to chat with professors appropriately and ethically?' :
           'What is morality and what is its importance in society?'}
            />
            </div>
      </div>

      </div>
      
      
    </main>
    )
}
export default function Page (){
    return <SidebarLayout>
      <SearchPage/>
    </SidebarLayout>
  }