import type { SpreadData } from "./pages/Spread";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "./context/authContext";
import cards from "./tarotcard/tarot-images";
import Quill from "./components/Editor/Quill";
import { openAiKey } from "../config";
import firebase from "./utils/firebase";
import { db } from "./utils/firebase";
import {
  doc,
  collection,
  addDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
interface Message {
  value: string;
  name: string;
  order: number;
  disabled: boolean;
  card: number;
  reverse: boolean;
}

const tarot = cards.cards;
const AskGPT = ({ divinedData, end, setEnd, askAI, setAskAI }) => {
  const { isLogin, user, userUID } = useContext(AuthContext);
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
  const [article, setArticle] = useState({
    ...divinedData,
    content: "",
    askGpt: "",
    secret: true,
    time: "",
  });
  useEffect(() => {
    const divinedResult = divinedData.spread.filter((data) => data !== 0);
    setMessages(divinedResult);
  }, [end, divinedData.spread]);
  useEffect(() => {
    setArticle({
      ...divinedData,
      content: "",
      askGpt: "",
      secret: true,
      time: "",
    });
  }, [messages, divinedData]);
  // useEffect(() => {
  //   setArticle({ ...article, askGpt: res });
  // }, [res]);
  const handleAsk = async () => {
    console.log("messages", messages);
    console.log("divinedData", divinedData);

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
  };

  //   async function storeQuestionAndAnswer(
  //     question: { message: any },
  //     answer: { message: any; sender?: string }
  //   ) {
  //     try {
  //       const userRef = doc(db, "users", userUID, "diary", userUID);
  //       await updateDoc(userRef, {
  //         question: question.message,
  //         answer: answer.message,
  //         timestamp: Timestamp.fromDate(new Date()),
  //       });
  //     } catch (error) {
  //       console.error("Error writing document: ", error);
  //     }
  //   }

  async function processMessageToChatGPT(newMessage: any[]) {
    let apiMessages = newMessage.map((messageObject) => {
      let role = "assistant";
      return { role: role, content: messageObject.message };
    });
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: apiMessages,
    };
    // console.log("apiMessages:", apiMessages);
    // console.log("apiRequestBody:", apiRequestBody);
    // const apiKey = openAiKey;
    const apiKey = "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";

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
        setArticle({ ...article, askGpt: content });
      })
      .catch((error) => {
        console.error("Error fetching API:", error);
      });
  }
  return (
    <>
      <button
        onClick={() => {
          handleAsk();
          setAskAI(true);
        }}
      >
        點我問小Chat
      </button>
      {end && askAI && (
        <>
          <div className=' w-[60%]  '>
            {/* {messages.map((mes, index) => (
              <div key={index}>
                <img
                  src={tarot[mes.card].img}
                  alt={tarot[mes.card].name}
                  className={`${mes.reverse ? "" : "rotate-180"}`}
                />
                <h1>{tarot[mes.card].name}</h1>
                <p>{res}</p>
              </div>
            ))} */}
            <p>{res}</p>
          </div>
        </>
      )}
      {end && (
        <div className='w-[60%]'>
          <Quill
            article={article}
            setArticle={setArticle}
            setEnd={setEnd}
            setAskAI={setAskAI}
            res={res}
            setRes={setRes}
          />
        </div>
      )}
    </>
  );
};

export default AskGPT;
