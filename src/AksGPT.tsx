import type { SpreadData } from "./pages/Spread";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "./context/authContext";
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
import cards from "./tarotcard/tarot-images";
const tarot = cards.cards;
const AskGPT = ({ spreadData, end, askAI, setAskAI }) => {
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
  useEffect(() => {
    const divinedResult = spreadData.spread.filter((data) => data !== 0);
    setMessages(divinedResult);
    console.log(divinedResult);
  }, [end, spreadData.spread]);

  const handleAsk = async () => {
    const message = `${spreadData.title} 我抽到${tarot[messages[0].card].name}${
      messages[0].reverse ? "正位" : "逆位"
    }，請幫我解釋`;
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
    console.log("apiMessages:", apiMessages);
    console.log("apiRequestBody:", apiRequestBody);

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer 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",
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
        <div
          className=' w-[800px] h-[600px] overflow-y-scroll p-16 bg-slate-300 z-20 mx-auto fixed top-1/2 left-1/2 
          transform -translate-x-1/2 -translate-y-1/2'
        >
          <img
            src={tarot[messages[0].card].img}
            alt={tarot[messages[0].card].name}
            className={`${messages[0].reverse ? "" : "rotate-180"}`}
          />
          <h1>{tarot[messages[0].card].name}</h1>
          <p>{res}</p>
        </div>
      )}
    </>
  );
};

export default AskGPT;
