import { ArrowLeftCircleIcon, HandThumbDownIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ChatBot from "./ChatBot";

const Resolution = () => {
    const router = useRouter();
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const API_KEY = "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";
    const [showChatbot, setShowChatbot] = useState(false); // State to control the visibility of the chatbot

    const handleLikeClick = () => {
        setLiked(true);
        setDisliked(false);
        setShowChatbot(false)
        alert("Thank you for liking the solution! 😊");
    };

    const handleDisLikeClick = () => {
        setDisliked(true)
        setLiked(false)
        setShowChatbot(true);
        alert("You can also use AsymtosBot! 😊")
    }
    return (
        <div className='flex flex-col p-3 overflow-x-hidden h-[100%]'>
            <div className="m-2 bg-dark rounded-md px-4 py-2 h-[97%]">
                <div className="flex flex-row h-16 py-1">
                    <button className="flex items-center w-1/6">
                        <ArrowLeftCircleIcon onClick={() => router.back()} className="w-8 h-8 mr-4 text-white hover:text-white" aria-hidden={true} />
                        <p className="py-3 text-white text-xl text-start sm:truncate sm:text-xl sm:tracking-tight">
                            Resolution
                        </p>
                    </button>
                </div>
                <div className='w-full px-4 rounded-md overflow-hidden py-2 bg-slate-200'>
                    <h1 className="text-lg">Selected Error</h1>
                    <h1 className="text-lg">Resolution</h1>
                    <ul className="text-dark">
                        <li>1.</li>
                        <li>2.</li>
                        <li>3.</li>
                    </ul>
                    <button onClick={handleLikeClick} disabled={liked}>
                        <HandThumbUpIcon className={`h-6 w-6 ${liked ? 'text-green-500' : 'text-gray-500'}`} />
                    </button>
                    <button onClick={handleDisLikeClick} disabled={disliked}>
                        <HandThumbDownIcon className={`h-6 w-6 ${disliked ? 'text-red-500' : 'text-gray-500'}`} />
                    </button>
                    {showChatbot && <ChatBot API_KEY={API_KEY} />}

                </div>
            </div>
        </div>
    )
}

export default Resolution

