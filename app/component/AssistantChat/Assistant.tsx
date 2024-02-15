import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { AiFillCloseCircle } from "react-icons/ai"
import { BiChat, BiSend } from "react-icons/bi"

type AssistantProps = {
    articleContext: string,
    articleId: any,
    userId: string
}
interface AssistantPropsInterface {
 props: AssistantProps   
}

type Chat = {
    role: string,
    message: string,
    userId: string,
    id: number
}

const AssistantPopUp : React.FC<AssistantPropsInterface> = ({props}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const defaultChat : Chat = {
        role: 'AI',
        message: 'Hello, I am a ethic assistant. How Can I help you?',
        userId: props.userId,
        id: -1
    } 
    const [chats, setChats] = useState<Chat[]>([defaultChat])

    useEffect(()=>{
        fetchChat();
    },[])

    


    const fetchChat = async () => {
        const res = await axios.post('/api/db/query', {
            queryString: `SELECT distinct a.message, a.role, a.id, a.user_identifier  FROM ARTICLE_CHAT_EMBEDDING a WHERE a.article_id = '${props.articleId}' AND 
            a.user_identifier = '${props.userId}' ORDER BY a.id ASC;`
        })
        console.log(res.data)
        const lst : Chat[]= []
        res.data.result.rows.forEach((chatData : any)=>{
            const chat : Chat = {
                role: chatData.role,
                message: chatData.message,
                userId: chatData.user_identifier,
                id: parseInt(chatData.id)
            }
            lst.push(chat)
        })
        setChats([defaultChat, ...lst])
    } 

    const textRef = useRef<HTMLInputElement>(null)

    const submitMessage = async () => {
        const text = textRef.current?.value
        if(!text){
            return alert('AN ERROR OCCURED')
        }
        try {

            const chat : Chat = {
                role: 'USER',
                message: text,
                userId: props.userId,
                id: -2,
            }

            setChats(prev => [...prev, chat])
            textRef.current.value = ''

            const result = await axios.post('/api/health/chat-with-bot/', {
                article: props.articleContext,
                articleId: props.articleId,
                userQuestion: text,
                userId: props.userId
            })

            console.log(result.data)
            
            if(result.data.message == 'SUCCESS'){
                console.log('UPDATE')
                await fetchChat()
            }
        } catch (error) {
            throw Error('500 Internal Server Error')
        }
    }

    return <div className={`fixed ${isOpen? 'flex flex-col top-0 left-0 p-4  w-[100vw] h-screen justify-center items-center ': 
    'bottom-8 right-8'}`}>
        {
            isOpen && <div className="md:ml-auto flex flex-col p-4  w-[90vw] md:w-[24rem] lg:w-[28rem] bg-blue-400 rounded-md h-[90vh] min-h-96">
            <div className="flex items-center">
                <h1 className="grow text-lg md:text-xl lg:text-2xl font-bold text-white">
                    EthicAssist
                </h1>
                <div onClick={()=>{
                        setIsOpen(false)
                    }} className="ml-2 text-2xl  text-white">
                    <AiFillCloseCircle />
                </div>
            </div>
            <div className="grow flex flex-col w-full overflow-y-auto py-2">
                    {
                        chats.map((data, index)=>{
                            return <div key={`${data.userId}-${index}`} className={`flex mb-2  h-min text-black flex-col w-full p-2 rounded-md 
                            ${data.role == 'USER'? 'bg-green-300' : 'bg-blue-300'} `}>
                                <h1 className="font-bold mb-2">
                                    {data.role == 'USER'? 'You' : 'Assistant'}
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
                    <input type="text" ref={textRef} onKeyDown={(ev)=>{
                            if(ev.key == 'Enter'){
                                submitMessage();
                            }
                    }} placeholder="Message Assistant..."  className="rounded-md text-base w-full text-black p-2 flex border border-green-400"/>
                </div>
                <div onClick={submitMessage} className="text-white text-2xl ml-2">
                    <BiSend/>
                </div>
            </div>
    </div>
        }
        {
            !isOpen && <div className="flex items-end justify-end bgx-green-600">
            <div className="p-6 flex items-center justify-center rounded-full text-xl text-white bg-blue-400">
        <BiChat onClick={()=>{
          setIsOpen(true)
        }}/>
      </div>
        </div>
        }
    </div>
}

export default AssistantPopUp