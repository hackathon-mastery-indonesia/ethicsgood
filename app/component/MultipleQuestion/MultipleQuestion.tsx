import { QuizNumberInformation } from "@/app/content/[id]/page"
import axios from "axios"
import { useRef, useState } from "react"


type MultipleChoicesProps = {
    question: string,
    questionNumber: number
    choiceList: Array<string>
    questionsData: any
    trueChoice: string
    maxQuestion: number,
    questionsInformation: Record<number,QuizNumberInformation>
    updateAnswer: (questionIndex: number, quizInfo: QuizNumberInformation ) => void
    updateIndex: (index:number) => void
    onCloseQuiz: ()=> void
}

interface MultipleChoicesPropsInterface{
    props: MultipleChoicesProps
}

const MultipleChoicesComponent : React.FC<MultipleChoicesPropsInterface> = ({props}) => {
   
    const [currentAnswer, setCurrentAnswer] = useState<string>('')
    const [isFinish, setIsFinish] = useState<boolean>(false)
    const isAnsweredYet = props.questionsInformation[props.questionNumber] != undefined && props.questionsInformation[props.questionNumber] != null
    const changeQuestion = (isNext: boolean) => {
        if(props.questionNumber == 0 && !isNext){
            return
        }
        if(props.questionNumber == props.maxQuestion - 1 && isNext){
            return
        }
        if(isNext){
            props.updateIndex(props.questionNumber+1)
        }
        else{
            props.updateIndex(props.questionNumber-1)
        }
        setCurrentAnswer('')
    }
    return <div className="flex flex-col w-full">
        {!isFinish && <div className="w-full flex mb-4">
                <div onClick={()=>{
                        props.onCloseQuiz()
                    }} className="px-2 py-1 rounded-md bg-blue-400 text-white font-bold text-center text-lg md:text-xl">
                                    Return to Study Cases
                                </div>
                </div>}
        <div className="flex w-full space-x-4 bg-gray-200 p-4">
        <div className="md:flex hidden h-min justify-center items-center">
        <div className="grid grid-cols-4 gap-4 p-4 " >
            {   
                
            !isFinish &&    Array.from({ length: props.maxQuestion }, (_, index) => <div key={`${index}-question-quiz`} onClick={()=>{
                    props.updateIndex(index)
                    setCurrentAnswer('')
                }}
                className={`${index == props.questionNumber? 'border-blue-600 border-2' : ''} w-8 h-8 flex items-center justify-center rounded-md text-center text-black ${!props.questionsInformation[index]? 'bg-blue-200' : props.questionsInformation[index].status? 'bg-green-300': 'bg-red-300'}  max-h-min`}>
                    <p>{index + 1}</p>
                </div>)
            }
        </div>
        </div>
        {
            !isFinish && <div className="grow flex flex-col w-full rounded-md  p-4 ">
            <div className="w-full  flex items-center mb-4">
                            <div className="px-2 py-1 mr-1 text-lg md:text-xl text- font-bold rounded-md flex items-center justify-center bg-blue-400 text-white">
                                        <h1>Question {props.questionNumber + 1}/{props.maxQuestion}</h1>
                            </div>
                            <div className="ml-auto flex items-center">
                                {
                                    props.questionNumber != 0 && <div onClick={()=>{
                                        changeQuestion(false)
                                    }} className="px-2 py-1 mr-1 text-lg md:text-xl text- font-bold rounded-md flex items-center justify-center bg-blue-400 text-white">
                                    <h1>Previous</h1>
                        </div>
                                }
                                {
                                    props.questionNumber < props.maxQuestion -1 && <div onClick={()=>{
                                        changeQuestion(true)
                                    }} className={`px-2 py-1 mr-1 text-lg md:text-xl text- font-bold rounded-md flex items-center justify-center  bg-blue-400 text-white`}>
                                    <h1>Next</h1>
                        </div>
                                }
                            </div>
                                    
            </div>
            <p className="text-blue-950 md:text-lg mb-4">{props.question}</p>
            {
                isAnsweredYet? <div className="flex flex-col w-full">
                    <label className="text-black font-semibold mb-2">Choices</label>
                    {
                        props.choiceList.map((choice,index)=>{
                            return <div key={`${choice}-${index}-multiple-question-choice`}  className={` bg-blue-300 text-black mb-4 rounded-full ${props.questionsInformation[props.questionNumber].userAnswer.trim() == choice? 'border-4 border-blue-600' : ''}  h-full px-4 py-3 justify-center flex flex-col`}>
                                <h1>{choice}</h1>
                            </div>
                        })
                    }
                    <label className="text-black font-semibold mb-2">Your Answer</label>
                    <div className={`p-4 w-full rounded-md text-black mb-2 ${props.questionsInformation[props.questionNumber].status? 'bg-green-300' : 'bg-red-300'}`}>
                        {props.questionsInformation[props.questionNumber].userAnswer}
                    </div>
                    <h1 className={`${props.questionsInformation[props.questionNumber].status? 'text-green-500' : 'text-red-500'} font-bold mb-2`}>
                    {props.questionsInformation[props.questionNumber].status? 'CORRECT' : 'INCORRECT'}
                    </h1>
                    <label className="text-black font-semibold mb-2">Explanation</label>
                    <div className={`p-4 w-full rounded-md text-black mb-2 bg-blue-300`}>
                        {props.questionsInformation[props.questionNumber].response}
                    </div>
                </div> : <div className="flex flex-col w-full">
                        <label className="text-black font-semibold mb-4">Answer</label>
                    {
                        props.choiceList.map((choice,index)=>{
                            return <div key={`${choice}-${index}-multiple-question`} onClick={()=>{
                                setCurrentAnswer(choice)
                            }} className={` bg-blue-300 text-black mb-4 rounded-full ${currentAnswer.trim() == choice? 'border-4 border-blue-600' : ''}  h-full px-4 py-3 justify-center flex flex-col`}>
                                <h1>{choice}</h1>
                            </div>
                        })
                    }
                            <div className="w-full flex items-center">
                                <div onClick={async ()=>{
                                if(currentAnswer == ''){
                                    alert('Answer cant be empty')
                                    return
                                }
                                const res = await axios.post('/api/health/multiple-choices-answer', {
                                    userAnswer: currentAnswer,
                                    question: props.question,
                                    choiceList: props.choiceList,
                                    trueChoice: props.trueChoice
                                })
                                //userAnswer, question, choiceList, trueChoice
                                const rawJson = res.data.result
                                const answer = JSON.parse(rawJson)
                                console.log(answer)
                                const newData: QuizNumberInformation = {
                                    status: answer.is_answer_true? answer.is_answer_true : false,
                                    response: answer.explanation,
                                    userAnswer: currentAnswer
                                }
                                props.updateAnswer(props.questionNumber, newData)
                                console.log(res)
                            }}  className="px-2 py-1 rounded-md bg-teal-400 text-black text-center">
                                    Evaluate
                                </div>
                            </div>
                </div>
            }
            {
                Object.keys(props.questionsInformation).length == props.maxQuestion && <div className="w-full flex mt-2 justify-end">
                    <div onClick={()=>{
                        setIsFinish(true)
                    }} className="px-2 py-1 rounded-md bg-blue-400 text-white font-bold text-center text-lg md:text-xl">
                                    Finish Quiz
                                </div>
                </div>
            }
            
            <div className="md:hidden flex h-min justify-center items-center ">
            <div className="grid grid-cols-4 gap-4 p-4 mt-4 " >
                {   
                    
                    Array.from({ length: props.maxQuestion }, (_, index) => <div key={`${index}-question-quiz`} onClick={()=>{
                        props.updateIndex(index)
                        setCurrentAnswer('')
                    }}
                    className={`${index == props.questionNumber? 'border-blue-600 border-2' : ''} w-8 h-8 flex items-center justify-center rounded-md text-center text-black ${!props.questionsInformation[index]? 'bg-blue-200' : props.questionsInformation[index].status? 'bg-green-300': 'bg-red-300'}  max-h-min`}>
                        <p>{index + 1}</p>
                    </div>)
                }
            </div>
            </div>
            
            </div>
        }
        {
            isFinish && <div className="flex flex-col">
                
                <div className="w-full flex justify-end mb-4">
                <div onClick={()=>{
                        props.onCloseQuiz()
                    }} className="px-2 py-1 rounded-md bg-blue-400 text-white font-bold text-center text-lg md:text-xl">
                                    Return to Study Cases
                                </div>
                </div>
                <div className="w-full flex flex-col mb-4">
                <h1 className="text-lg text-blue-600 md:text-xl font-bold mb-2">Result</h1>
                <p className="text-black font-bold">Your Score is {Object.values(props.questionsInformation).filter(data=>data.status).length * 100/ Object.values(props.questionsInformation).length}</p>
                </div>
                {Object.keys(props.questionsInformation).map((key, index)=>{
                    return <div key={`${index}-finish-answer`} className="flex flex-col w-full">
                    <div className="w-full font-bold text-blue-400">
                        Question {index+1} 
                    </div>
                    <div className={`p-4 w-full rounded-md text-black mb-2`}>
                        {props.questionsData[index].question}
                    </div>
                    <label className="text-black font-semibold mb-2">Choices</label>
                    {
                        props.choiceList.map((choice,index)=>{
                            return <div key={`${choice}-${index}-multiple-question-choice`}  className={`rounded-md bg-blue-300 text-black mb-4 ${props.questionsInformation[props.questionNumber].userAnswer.trim() == choice? 'border-4 border-blue-600' : ''}  h-full px-4 py-3 justify-center flex flex-col`}>
                                <h1>{choice}</h1>
                            </div>
                        })
                    }
                    <label className="text-black font-semibold mb-2">Your Answer</label>
                    <div className={`p-4 w-full rounded-md text-black mb-2 ${props.questionsInformation[index].status? 'bg-green-300' : 'bg-red-300'}`}>
                        {props.questionsInformation[index].userAnswer}
                    </div>
                    <h1 className={`${props.questionsInformation[index].status? 'text-green-500' : 'text-red-500'} font-bold mb-2`}>
                    {props.questionsInformation[index].status? 'CORRECT' : 'INCORRECT'}
                    </h1>
                    <label className="text-black font-semibold mb-2">Explanation</label>
                    <div className={`p-4 w-full rounded-md text-black mb-2 bg-blue-300`}>
                        {props.questionsInformation[index].response}
                    </div>
                </div> 
                })}
            </div>
            }
        </div>
        
    </div>
}
export default MultipleChoicesComponent