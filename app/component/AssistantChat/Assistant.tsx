import { useRef, useState } from "react"
import { AiFillCloseCircle } from "react-icons/ai"
import { BiChat, BiSend } from "react-icons/bi"

type AssistantProps = {
    articleContext: string,
    userId: string
}
interface AssistantPropsInterface {
 props: AssistantProps   
}

type Chat = {
    role: string,
    message: string,
    userId: string,
}

const AssistantPopUp : React.FC<AssistantPropsInterface> = ({props}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [chats, setChats] = useState<Chat[]>([{
        role: 'AI',
        message: 'Hello, I am a ethic assistant. How Can I help you?',
        userId: props.userId
    }])
    const textRef = useRef<HTMLInputElement>(null)
    return <div className="flex flex-col absolute right-8 bottom-8 z-20">
        {
            isOpen? <div className="flex flex-col p-4  min-w-full md:min-w-[24rem] lg:min-w-[28rem] bg-blue-600 rounded-md h-[90vh] min-h-96">
                    <div className="flex items-center">
                        <h1 className="grow text-lg md:text-xl lg:text-2xl font-bold text-white">
                            EthicAssist
                        </h1>
                        <div className="ml-2 text-2xl  text-white">
                            <AiFillCloseCircle onClick={()=>{
                                setIsOpen(false)
                            }}/>
                        </div>
                    </div>
                    <div className="grow flex w-full overflow-y-auto py-2">
                            {
                                chats.map((data, index)=>{
                                    return <div key={`${data.userId}-${index}`} className={`flex h-min text-black flex-col w-full p-2 rounded-md bg-blue-300`}>
                                        <h1 className="font-bold mb-2">
                                            {data.role == 'user'? 'You' : 'Assistant'}
                                        </h1>
                                        <p>
                                            {data.message}
                                        </p>

                                    </div>
                                })
                            }
                    </div>
                    <div className="flex w-full items-center">
                        <div className="grow">
                            <input type="text" ref={textRef} placeholder="Message Assistant..."  className="rounded-md text-base w-full text-black p-2 flex border border-green-400"/>
                        </div>
                        <div className="text-white text-2xl ml-2">
                            <BiSend/>
                        </div>
                    </div>
            </div>:<div className="p-6 rounded-full text-xl text-white bg-blue-600">
            <BiChat onClick={()=>{
              setIsOpen(true)
            }}/>
          </div>
          
        }
    </div>
}

export default AssistantPopUp