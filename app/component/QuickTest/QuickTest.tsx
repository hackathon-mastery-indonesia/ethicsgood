import axios from "axios"
import { useRef, useState } from "react"
import Loading from "../Loading/LoadingIcon"

type QuickTestProps = {
    question: string
}

interface QuickTestInterface{
    props : QuickTestProps
}

const QuickTest : React.FC<QuickTestInterface> = ({props}) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [response, setResponse] = useState<string>('')
    const textRef = useRef<HTMLTextAreaElement>(null)
    const [userAnswer, setUserAnswer] = useState<string>('')
    const submitAnswer = async () => {
        if(textRef.current == null || textRef.current == undefined){
            alert('Something wrong with the system')
            return
        }
        const text = textRef.current.value
        if(text.trim() == ''){
            alert('Cant send empty answer')
            return
        }
        try {
            setLoading(true)
            const ans = await axios.post('/api/health/quick-answer', {
                userAnswer: text,
                question: props.question
            })
            const res = ans.data
            setResponse(res.answer)
            setUserAnswer(textRef.current.value)
            textRef.current.value = ''
            setLoading(false)
        } catch (error) {
            setLoading(false)
            alert('Error on server. Please try again.')
        }

    }

    return <div className="flex flex-col text-black p-4 bg-blue-200 rounded-md">
        {loading && <Loading/>}
        <div className="flex mb-2">
        <p className="text-black rounded-md text-center px-2 py-1 bg-indigo-400 text-xs">Comprehension Check</p>
        </div>
        <p className="mb-2">{props.question}</p>
        <div className="flex flex-col ">
            <label className="text-sm mb-2 text-black">Answer</label>
            {
                response == ''? <textarea required
                ref={textRef}
                maxLength={300}
                className="p-3 mb-2 h-32 border border-neutral-700 rounded-md w-full text-black px-3 py-3 mt-1 bg-neutral-300"
                placeholder="Please write your opinion"
            ></textarea> : 
            <div className="flex flex-col">
                <div className="flex mb-2">
                <p className="text-black rounded-md text-center px-2 py-1 bg-indigo-400 text-xs">Your answer</p>
                </div>
                <p className="p-2 rounded-md bg-blue-400">{userAnswer}</p>
            </div>
            }
            {
                response == ''? <div className="w-full flex justify-end">
                <button  onClick={submitAnswer} className="px-3 py-2 rounded-md bg-blue-400 text-center">Submit</button>
            </div> : 
            <div className="flex flex-col mt-2">
                <div className="flex mb-2">
                <p className="text-black rounded-md text-center px-2 py-1 bg-indigo-400 text-xs">Evaluation</p>
                </div>
                <p className="mb-2 p-2 rounded-md bg-blue-400">{response}</p>
                <div className="flex">
                <button  onClick={()=>{
                    setResponse('')
                    setUserAnswer('')
                }} className="px-3 py-2 rounded-md bg-blue-400 text-center">Retry Answer</button>
                </div>
            </div>
            }
        </div>
    </div>
}

export default QuickTest