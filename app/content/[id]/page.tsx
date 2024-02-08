'use client'
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ArticleSidebarLayout } from "@/app/layout/SidebarLayout";
import query from "@/app/api/db/query";
import { useRouter } from "next/navigation";
import QuickTest from "@/app/component/QuickTest/QuickTest";
import Loading from "@/app/component/Loading/LoadingIcon";
import EssayComponent from "@/app/component/Essay/Essay";
import MultipleChoicesComponent from "@/app/component/MultipleQuestion/MultipleQuestion";

function tryParseInt(value: string): number | null {
    try {
      const parsedValue = parseInt(value, 10); // 10 is the radix/base, use 10 for decimal
      if (isNaN(parsedValue)) {
        throw new Error('Parsing failed');
      }
      return parsedValue;
    } catch (error:any) {
      console.error('Error parsing:', error.message);
      return null;
    }
  }

type ContentPageProps = {
    currentSection : string,
    id: string
}

export type QuizNumberInformation = {
    status: boolean,
    response: string
    userAnswer: string
}

type QuizSetup = {
    quizLength: number,
    currentIndex: number,
    type: string,
    information: Record<number, QuizNumberInformation>

}

const ContentPage : React.FC<ContentPageProps> = ({currentSection, id}) => {
    const [content, setContent] = useState<any>(null)
    const [isLoading,setIsLoading] = useState<boolean>(false)
    const [selectedStudyCase, setSelectedStudyCase] = useState<string>('')
    const [selectedAnswerType, setSelectedAnswerType] = useState<string>('')
    const [isOnQuiz, setIsOnQuiz] = useState<boolean>(false)
    const [currentQuiz, setCurrentQuiz] = useState<any>(null)
    const [quizSetup, setQuizSetup] = useState<QuizSetup|null>(null)
    const isReadyToStartQuiz = selectedStudyCase != '' && selectedAnswerType != ''
    const router = useRouter()
    console.log(isOnQuiz)
    console.log(quizSetup)
    useEffect(()=>{
        fetchArticle()
    },[])

    const fetchArticle = async () => {
        setIsLoading(true)
        const articleId = tryParseInt(id)
        if(articleId == null){
            router.push('/undefined')
            return
        }
        const res = await axios.post('/api/db/query', {
            queryString: `SELECT * FROM ARTICLE WHERE id = ${articleId}`
        })
        const data = res.data
        const rows = data.result.rows
        const content = JSON.parse(rows[0].json)
        console.log(content)
        setContent(content)
        setIsLoading(false)
    }
    
    return (
        <main className="flex min-h-screen overflow-y-auto w-full flex-col items-center justify-start  pt-16 md:pt-12 pb-10 bg-white px-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
      </div>
      {
        isLoading && <Loading/>
      }
      <div className="w-full flex flex-col max-w-5xl mx-auto">
        {
            currentSection == 'Content' && content != null &&
            <div className="w-full  flex flex-col max-w-5xl mx-auto">
                <h1 className="text-blue-600 text-2xl md:text-4xl  font-bold">
                    {content.article_title}
                </h1>
                <div className="flex w-full flex-wrap space-x-3 space-y-2 -mx-3">
                    <div></div>
                    {
                        content.categories.map((category: any, index: number)=> {
                            return <a href="" key={`category ${index} ${category}`} className=" bg-blue-400 text-white text-xs md:text-sm rounded-md text-center px-2 py-1">{category}</a>
                        })
                    }
                </div>
                <div className="flex w-full mt-4 text-justify text-base text-blue-950">
                    {content.introduction}
                </div>
                <div className="flex w-full mt-4 mb-2 text-justify text-xl md:text-2xl font-bold text-blue-600">
                    {'TIPS'}
                </div>
                <div className="flex flex-col w-full mb-2">
                    {content.solutions.map((solution:any, index: number) =>{
                        return <div key={`${solution.title} ${index} solution`} className="flex flex-col w-full mb-4">
                            <h1 className="text-lg md:text-xl font-bold text-blue-400 mb-2">{index+1}. {solution.title}</h1>
                            <p className="text-black">{solution.description}</p>
                            {
                                solution.example.map((exm: any, index: number) =>{
                                    return <div key={`${index} example ${solution.title}`} className="p-4 text-black mb-2 rounded-md bg-blue-300 flex flex-col">
                                        <div className="flex mb-2">
                                        <p className="text-black rounded-md text-center px-2 py-1 bg-indigo-400 text-xs">Example {index+1}</p>
                                        </div>
                                        <p>{exm}</p></div>
                                })
                            }
                            {
                              solution.question && <QuickTest props={{question: `${solution.question}`}}/>
                            }
                        </div>
                    })}
                </div>
                <div className="flex flex-col w-full mb-2 text-blue-950">
                    {content.conclusion}
                </div>
            </div>
        }
        {
            currentSection == 'Video' &&
            <div className="w-full  flex flex-col max-w-5xl mx-auto">

            </div>
        }
        {
            currentSection == 'Study Case Assesment' &&
            <div className="w-full flex flex-col max-w-5xl mx-auto">
                {
                    !isOnQuiz && <div className="w-full flex flex-col">
                        <h1 className="text-center text-2xl md:text-3xl font-bold text-blue-600">Select One Study Case</h1>
                        {
                           <div className="grid grid-cols-2 md:gap-4 gap-2 mt-8">
                                {
                                    content && content.study_cases.map((kasus:any, index: number) =>{
                                        return <div key={`kasus-${index}-content`} onClick={()=>{
                                            setSelectedStudyCase(kasus)
                                        }}
                                        className={`md:col-span-1 col-span-2 ${selectedStudyCase == kasus? 'border-4 border-blue-600' : ''} bg-blue-300 flex items-center justify-center text-black text-center rounded-full   px-4 py-3`}> 
                                            <h1>{kasus}</h1>
                                        </div>
                                    })
                                }
                           </div>
                        }
                        <h1 className="mt-8 text-center text-2xl md:text-3xl font-bold text-blue-600">Select Assesment Type</h1>
                        <div className="mt-8 w-full  text-black   text-center grid grid-cols-2   mx-auto gap-x-2 md:gap-x-4">
                            <div onClick={()=>{
                                setSelectedAnswerType('MULTIPLE_CHOICES')
                            }} className={` bg-blue-300 rounded-full ${selectedAnswerType == 'MULTIPLE_CHOICES'? 'border-4 border-blue-600' : ''}  h-full px-4 py-3 justify-center flex flex-col`}>
                                <h1>Multiple Choice</h1>
                            </div>
                            <div onClick={()=>{
                                setSelectedAnswerType('ESSAY')
                            }}  className={` bg-blue-300 rounded-full ${selectedAnswerType == 'ESSAY'? 'border-4 border-blue-600' : ''} h-full px-4 py-3 justify-center flex flex-col`}>
                                <h1>Essay</h1>
                            </div>
                        </div>
                        {
                            isReadyToStartQuiz && <div className="w-full flex justify-center mt-8 ">
                            <button onClick={async()=>{
                                setIsLoading(true)
                                try {                  
                                    const res = await axios.post('/api/health/create-quiz', {
                                        answerType: selectedAnswerType,
                                        problem: selectedStudyCase
                                    })
                                    const quiz = JSON.parse(res.data.quiz)
                                    setCurrentQuiz(quiz)
                                    setIsOnQuiz(true)
                                    const quizSetup: QuizSetup = {
                                        currentIndex: 0,
                                        quizLength: quiz.question_list.length,
                                        type: res.data.answerType,
                                        information: {}
                                    }
                                    setQuizSetup(quizSetup)
                                    console.log(quizSetup)
                                } catch (error) {
                                    
                                }
                                setIsLoading(false)
                            }}   className="px-4 py-3  rounded-full bg-blue-600 text-center 
                            w-full flex items-center justify-center md:w-[50%] font-bold"><h1>Start Assesment</h1></button>
                        </div> 
                        }
                        
                    </div>
                }

                {
                    
                    isOnQuiz && quizSetup && <div className="w-full flex flex-col">
                    
                        {
                            quizSetup.type == 'ESSAY' && <EssayComponent props={{
                                questionList: currentQuiz.question_list,
                                questionsInformation:quizSetup.information,
                                updateIndex: (index)=>{
                                    const updated = {...quizSetup}
                                    updated.currentIndex = index
                                    setQuizSetup(updated)

                                },
                                onCloseQuiz:()=>{
                                    setIsOnQuiz(false)
                                    setQuizSetup(null)
                                },
                                questionNumber: quizSetup.currentIndex,
                                maxQuestion: quizSetup.quizLength,
                                updateAnswer:(questionIndex, questionInformation)=>{
                                    const data = {...quizSetup}
                                    data.information[questionIndex] = questionInformation
                                    setQuizSetup(data)
                                },

                                question: currentQuiz.question_list[quizSetup.currentIndex]
                            }}/>
                        }

                        {
                            quizSetup.type == 'MULTIPLE_CHOICES' && <MultipleChoicesComponent
                            props={{
                                question: currentQuiz.question_list[quizSetup.currentIndex].question,
                                questionNumber: quizSetup.currentIndex,
                                choiceList: currentQuiz.question_list[quizSetup.currentIndex].choice_list,
                                questionsData: currentQuiz.question_list,
                                trueChoice: currentQuiz.question_list[quizSetup.currentIndex].true_choice,
                                maxQuestion:quizSetup.quizLength,
                                questionsInformation:quizSetup.information,
                                updateAnswer:(questionIndex, questionInformation)=>{
                                    const data = {...quizSetup}
                                    data.information[questionIndex] = questionInformation
                                    setQuizSetup(data)
                                },
                                updateIndex: (index)=>{
                                    const updated = {...quizSetup}
                                    updated.currentIndex = index
                                    setQuizSetup(updated)
                                },
                                onCloseQuiz:()=>{
                                    setIsOnQuiz(false)
                                    setQuizSetup(null)
                                },
                            }}
                            />
                        }
                    </div>
                    
                }
            </div>
        }
        {
            currentSection == 'Quiz' &&
            <div className="w-full  flex flex-col max-w-5xl mx-auto">

            </div>
        }
        
      </div>
      
      
    </main>
    )
}

export default function Page ({ params }: { params: { id: string } }){
    const [section, setSection] = useState<string>('Content')
    const id = params.id
    return <ArticleSidebarLayout onSidebarChange={(title)=>{
        setSection(title)
    }}>
      <ContentPage currentSection={section} id={id}/>
    </ArticleSidebarLayout>
  }