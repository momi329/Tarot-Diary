import type { SpreadData } from "../pages/Spread";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import cards from "../tarotcard/tarot-images";
import Quill from "./Editor/Quill";
import { openAiKey } from "../config";
import Star from "../images/Star";
interface Message {
  value: string;
  name: string;
  order: number;
  disabled: boolean;
  card: number;
  reverse: boolean;
}

const tarot = cards.cards;
const AskGPT = ({
  divinedData,
  setDivinedData,
  askAI,
  setAskAI,
  divining,
  dispatch,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      value: "",
      name: "",
      order: 1,
      disabled: true,
      card: 75,
      reverse: true,
    },
  ]);
  const [res, setRes] = useState([]);
  const { loading, setLoading } = useContext(AuthContext);

  useEffect(() => {
    const divinedResult = divinedData.spread.filter((data) => data !== 0);
    setMessages(divinedResult);
  }, [divinedData.spread]);

  const handleAsk = async () => {
    console.log("messages", messages);
    console.log("openAiKey", openAiKey);
    setLoading(true);
    const message = `我問塔羅牌${divinedData.question}，我在${messages.map(
      (mes) =>
        `${mes.value}的位置抽到${tarot[mes.card].name} ${
          mes.reverse ? "正位" : "逆位"
        }`
    )}，請幫我解釋`;
    const newMessage = [
      {
        message: message,
        direction: "outgoing",
        sentTime: new Date().toLocaleString(),
      },
    ];
    await processMessageToChatGPT(newMessage);
    setLoading(false);
  };

  async function processMessageToChatGPT(newMessage: any[]) {
    let apiMessages = newMessage.map((messageObject) => {
      let role = "assistant";
      return { role: role, content: messageObject.message };
    });
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: apiMessages,
    };
    const apiKey = openAiKey;

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log("data", data);
        const content = data.choices[0].message.content;
        console.log(content);
        setRes(content);
        setDivinedData({ ...divinedData, askGpt: content, content: "" });
      })
      .catch((error) => {
        console.error("Error fetching API:", error);
      });
  }
  return (
    <div className='flex flex-row '>
      <div className='flex flex-col w-[48%] '>
        <button
          className={`text-xl font-NT text-pink tracking-[1px] 
          flex flex-row gap-4  duration-1000 ${
            askAI || loading ? "" : "animate-bounce"
          }
               group-hover:opacity-1  p-4 bg-black/40 w-[80%] items-center justify-start`}
          onClick={() => {
            handleAsk();
            setAskAI(true);
          }}
          disabled={askAI}
        >
          <Star color={"#F4E4C3"} />
          {loading ? (
            <>
              <p className='shadowPink'>Asking AI </p>
              <div className='container self-start'>
                <div className='block'></div>
                <div className='block'></div>
                <div className='block'></div>
                <div className='block'></div>
              </div>
            </>
          ) : (
            <div>
              <p className='shadowPink'> Ask AI Get Your Tarot Reading!</p>
              <p className='text-base text-gray font-notoSansJP text-start'>
                點擊按紐等待AI智慧塔羅解牌
              </p>
            </div>
          )}
        </button>
        {/* <button
          onClick={() => {
            handleAsk();
            setAskAI(true);
          }}
          className='font-NT text-xl hover:underline text-yellow shadowYellow w-20'
          value={"Ask AI"}
        >
          Ask AI
        </button> */}
        {divining === 3 && askAI && (
          <>
            <div className=' text-sm leading-6 text-yellow my-2'>
              <p>{res}</p>
            </div>
          </>
        )}
      </div>
      <div className='flex flex-col gap-2 justify-between items-center '>
        <Star color={"#E18EA5"} />
        <div className='my-3 w-[1px] bg-pink h-[100%]' />
        <Star color={"#E18EA5"} />
      </div>
      {divining === 3 && (
        <div className='w-[48%] '>
          <button
            className='text-xl font-NT text-pink tracking-[1px] mb-7 mx-auto
          flex flex-row gap-4 hover:animate-bounce hover:animate-pulse cursor-auto
               group-hover:opacity-1  p-4 bg-black/40 w-[80%] items-center justify-start'
          >
            <Star color={"#F4E4C3"} />
            <div>
              <p className='shadowPink'> Write Your Diary!</p>
              <p className='text-base text-gray font-notoSansJP text-start'>
                寫下一些筆記心得吧！
              </p>
            </div>
          </button>
          <Quill
            divinedData={divinedData}
            setDivinedData={setDivinedData}
            setAskAI={setAskAI}
            res={res}
            setRes={setRes}
            divining={divining}
            dispatch={dispatch}
          />
        </div>
      )}
    </div>
  );
};

export default AskGPT;
