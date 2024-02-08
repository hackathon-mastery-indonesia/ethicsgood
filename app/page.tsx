'use client'

import axios from "axios";
import SearchBar from "./component/SearchBar/SearchBar";
import SidebarLayout from "./layout/SidebarLayout";
import { useState } from "react";
import { useRouter, usePathname } from 'next/navigation';


function Home() {

  const [text,setText] = useState<string>('')
  const router = useRouter()
   
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-start  pt-12 pb-10 bg-white px-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
      </div>
      <div className="w-full flex flex-col max-w-5xl mx-auto">
    
      <div className="w-full flex flex-col mt-8">
          <div className="w-full max-w-3xl mx-auto flex mb-4">
              <h1 className="text-center mx-auto  text-3xl font-bold text-black mb-4">
                <span className="text-blue-500">EthicsGood: </span>Interactive AI-Powered Guide to Ethics and Etiquette.
              </h1>
            </div>
            
            <div className="flex flex-col max-w-3xl mx-auto">
            <p className="mx-auto text-black text-sm text-justify mb-2">
            EthicsGood is an innovative interactive platform designed to serve as your personal guide to ethics and etiquette, powered by advanced artificial intelligence technology. Whether you are navigating professional settings, social interactions, or ethical dilemmas, EthicsGood is here to provide insightful guidance every step of the way.
            </p><p className="mx-auto text-black text-sm text-justify">
            {`Furthermore, you have the opportunity to immerse yourself in interactive ethical scenarios, where you can practice navigating complex dilemmas with AI assistance. Through engaging in these simulations, you'll hone your ethical decision-making skills and develop a nuanced understanding of how to apply ethical principles in various aspects of your life. Additionally, by participating in interactive ethics quizzes, you'll strengthen your grasp of ethical concepts and refine your ability to apply them effectively in real-world situations, whether in personal relationships, social interactions, or civic engagements`}
            </p>
            </div>
            <div className="w-full max-w-3xl mx-auto flex mb-4 mt-4">
              <h1 className="text-center mx-auto  text-3xl font-bold text-black mb-4">
                <span className="text-blue-500">Moral Shortcomings</span> Drive Younger Generations to Cause Various Issues Such as Bullying and Discrimination
              </h1>
            </div>
            
            <div className="flex flex-col max-w-3xl mx-auto">
            <p className="mx-auto text-black text-sm text-justify mb-2">
            EthicsGood was created in response to the observed trend among Generation Z where many individuals tend to overlook or lack understanding of ethics, leading to various social issues such as bullying, discrimination, racism, and others. We find these issues deeply concerning, which prompted us to develop a smart platform aimed at enhancing ethical awareness, particularly among Generation Z. We believe that by addressing the fundamental aspect of ethics, we can promote equality, anti-discrimination, and anti-bullying initiatives to foster a more meaningful and ethical generation. Our ultimate goal is to cultivate a society where ethical principles are upheld, leading to a more harmonious and just community for all.
            </p>
            </div>
            <div className="w-full flex flex-col items-center  mt-6 max-w-3xl mx-auto">
               <h1 className="text-center mx-auto  text-3xl font-bold text-blue-600 mb-4">
                <span className="text-black">
        Learn the Ethics Guidelines You Want with </span> Prompt
              </h1>
                <p className="mx-auto mb-2 text-black text-sm text-justify">
                EthicsGood utilizes a combination of LLM technology and Vector Similarity Search to create interactive and collaborative ethics learning content based on user-entered prompts.
                </p><button onClick={()=>{
                  router.push('/prompt')
                }} className="text-white bg-blue-500 text-center px-4 py-2 font-bold text-sm md:text-base rounded-full">Start Prompting Now</button>   
                
            </div>
      </div>

      </div>
      
      
    </main>
  );
}

export default function Page (){
  return <SidebarLayout>
    <Home/>
  </SidebarLayout>
}
