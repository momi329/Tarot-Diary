import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import cards from "../tarotcard/tarot-images";
import { openAiKey } from "../config";
import Star from "../images/Star";
import Loading from "./Loading";
import Button from "./Button";
import Editor, { EditorContentChanged } from "./Editor/Editor";
import firebase from "../utils/firebase";
import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
const tarot = cards.cards;
const AskAndNote = ({
  divinedData,
  setDivinedData,
  askAI,
  setAskAI,
  divining,
  dispatch,
}: any) => {
  const { userUID } = useContext(AuthContext);
  const { loading, setLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAsk = async () => {
    setLoading(true);
    const divinedResult = divinedData.spread.filter((data) => data !== 0);
    const message = `我問塔羅牌${divinedData.question}，我在${divinedResult.map(
      (mes) =>
        `${mes.value}的位置抽到${tarot[mes.card].name} ${
          mes.reverse ? "正位" : "逆位"
        }`
    )}，先幫我總結再請幫我依據牌意解釋`;
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
  async function createDivinedData(data, userUID) {
    const docId = await firebase.newDivinedData(data, userUID);
    if (docId) {
      setDivinedData({ ...data, docId: docId });
    } else {
    }
  }
  const handleSave = () => {
    const newData = { ...divinedData, time: Timestamp.fromDate(new Date()) };
    createDivinedData(newData, userUID);
    dispatch({ type: "preview" });
    setAskAI(false);
    navigate(`/profile/${userUID}`);
  };
  async function processMessageToChatGPT(newMessage: any[]) {
    try {
      let apiMessages = newMessage.map((messageObject) => {
        let role = "assistant";
        return { role: role, content: messageObject.message };
      });
      const apiRequestBody = {
        model: "gpt-3.5-turbo",
        messages: apiMessages,
      };
      const apiKey = openAiKey;

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(apiRequestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching API");
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      setDivinedData({ ...divinedData, askGpt: content, content: "" });
    } catch (error) {
      console.error("Error fetching API:", error);
    }
  }

  const onEditorContentChanged = (content: EditorContentChanged) => {
    setDivinedData({ ...divinedData, content: content.markdown });
  };
  return (
    <div className='flex flex-row '>
      <div className='flex flex-col w-[48%] '>
        <button
          className={`text-xl font-NT text-pink tracking-[1px] cursor-pointer
          flex flex-row gap-4  duration-1000 ${
            askAI || loading ? "" : "animate-bounce"
          } group-hover:opacity-1  p-4 bg-black/40 w-[80%] items-center justify-start`}
          onClick={() => {
            handleAsk();
            setAskAI(true);
          }}
          disabled={askAI}
        >
          <Star color={"#F4E4C3"} />
          {loading ? (
            <Loading text={"Asking AI"} />
          ) : (
            <div>
              <p className='shadowPink cursor-pointer'>
                {" "}
                Ask AI Get Your Tarot Reading!
              </p>
              <p className='cursor-pointer text-base text-gray font-notoSansJP text-start'>
                點擊按紐等待AI智慧塔羅解牌
              </p>
            </div>
          )}
        </button>

        {divining === "end" && askAI && (
          <>
            <div className='mt-2 '>
              <p className='whitespace-pre-wrap break-all text-sm leading-6 text-yellow my-2'>
                {divinedData.askGpt}
              </p>
            </div>
          </>
        )}
      </div>
      <div className='flex flex-col gap-2 justify-between items-center '>
        <Star color={"#E18EA5"} />
        <div className='my-3 w-[1px] bg-pink h-[100%]' />
        <Star color={"#E18EA5"} />
      </div>
      {divining === "end" && (
        <div className='w-[48%] '>
          <button
            className='text-xl font-NT text-pink tracking-[1px] mb-7 mx-auto
          flex flex-row gap-4 cursor-auto group-hover:opacity-1  p-4 bg-black/40 w-[80%] 
          items-center justify-start'
          >
            <Star color={"#F4E4C3"} />
            <div>
              <p className='shadowPink'>Write Your Diary!</p>
              <p className='text-base text-gray font-notoSansJP text-start'>
                寫下一些筆記心得吧！
              </p>
            </div>
          </button>

          <div className='w-[100%]  flex flex-col justify-center items-center'>
            <p className='text-gray text-sm tracking-widest  self-start ml-2 mb-3'>
              記得按下儲存，才能紀錄占卜結果喔！
            </p>
            <Editor
              value={divinedData.content}
              onChange={onEditorContentChanged}
            />
            <div
              className={`self-end mt-2 animate-bounce ${
                askAI ? "" : "animate-bounce"
              } `}
            >
              <Button action={handleSave} type={"small"} value={"Save"} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AskAndNote;
