import { AiOutlineMinus } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { VscAdd } from "react-icons/vsc";

function Drag({
  dragInfo,
  shineArr,
  setDragInfo,
  drop,
  lightCard,
  change,
  deleteCard,
  editCard,
  handleOptionChange,
  onSave,
  setOnSave,
}) {
  const onDragging = () => {
    const newDragInfo = { ...dragInfo };
    newDragInfo.shine = shineArr();
    setDragInfo(newDragInfo);
  };
  return (
    <>
      <div
        className="flex flex-wrap justify-center max-w-screen-md border border-yellow z-1 
      mx-auto  border-opacity-50 mb-14 p-[30px] pb-[133px] backdrop-blur-sm bg-white/10 "
      >
        {onSave.spread.map((item, i) => {
          return (
            <div
              className={`flex justify-center box-border w-[144px] h-[113px]  ${
                dragInfo.shine[i] ? "bg-pink opacity-60" : ""
              }`}
              key={i}
              onDragEnter={() => onDragging()}
              onDragLeave={() => onDragging()}
              onDragOver={(e) => {
                e.preventDefault();
                const newDragInfo = { ...dragInfo };
                newDragInfo.shine = shineArr();
                newDragInfo.shine[i] = true;
                setDragInfo(newDragInfo);
              }}
              onDrop={() => drop(i)}
            >
              {typeof item === "object" && ( //todo background
                <div
                  style={{
                    background: `center/contain url(${lightCard})`,
                  }}
                  className={` rounded-xl w-[138px] h-[220px]  relative box-border cursor-grab
                  flex items-center justify-center flex-col bg-slate-800 text-yellow z-10 gap-2 bg-opacity-80`}
                  draggable={true} //TODO
                  onDragStart={(e) => {
                    (e.target as HTMLElement).style.opacity = "0.01";
                    const newDragInfo = { ...dragInfo };
                    newDragInfo.target = item;
                    newDragInfo.pastIndex = i;
                    newDragInfo.shine = shineArr();
                    setDragInfo(newDragInfo);
                  }}
                  onDragEnd={(e) => {
                    (e.target as HTMLElement).style.opacity = "1";
                  }}
                >
                  <>
                    <textarea
                      className={`p-2 outline-none opacity-100 absolute top-9 text-green rounded-lg text-center 
                    w-[100px] h-[130px] resize-none  z-20 text-base text-slate-700 font-normal font-notoSansJP tracking-widest
                    ${
                      item.disabled ? " text-green bg-opacity-40 bg-white " : ""
                    }`}
                      disabled={item.disabled}
                      onKeyDown={(e) => change(e, item, i)}
                      onChange={(e) => change(e, item, i)}
                      value={item.value}
                      readOnly={item.disabled}
                    />
                    <RxCross1
                      className="material-symbols-outlined text-green order-2 top-[6px]
                        left-2 absolute w-[17px] h-[25px] m-1 z-40 cursor-pointer"
                      onClick={() => {
                        deleteCard(item);
                      }}
                    />

                    <div
                      className={`material-symbols-outlined  text-green cursor-pointer m-1  text-base font-NT shadowGreen
                    absolute z-40 top-[8px] right-2 tracking-wider ${
                      item.disabled ? "" : "opacity-0"
                    }`}
                      onClick={() => {
                        editCard(item, i);
                      }}
                    >
                      EDIT
                    </div>
                    <select
                      defaultValue={item.order}
                      onChange={(e) => handleOptionChange(e, item, i)}
                      className="text-green border-b-green bg-white cursor-pointer outline-none bottom-2 shadowBlack
                         pl-7 pr-6 pt-[5px] pb-[4px] rounded-sm bg-opacity-30 absolute font-NT text-base"
                    >
                      {onSave.spread
                        .filter((item) => item !== 0)
                        .map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                    </select>
                  </>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex flex-row gap-5 w-[300px] mx-auto mb-40">
        <div
          className="w-20 h-20 rounded-full  border-[2px] border-pink mx-auto justify-center items-center flex 
         hover:bg-pink hover:bg-opacity-60 hover:text-yellow hover:border-yellow hover:shadowYellow
        font-NT shadowPink text-8xl text-pink leading-4 text-center opacity-90 z-[2]"
          onClick={() => {
            setOnSave((prevState) => ({
              ...prevState,
              spread: [...prevState.spread, 0, 0, 0, 0, 0, 0, 0],
            }));
          }}
        >
          <VscAdd className="w-10 h-10 self-center" />
          <div></div>
        </div>

        <div
          className="w-20 h-20 rounded-full  border-[2px] border-pink mx-auto justify-center items-center flex 
         hover:bg-pink hover:bg-opacity-60 hover:text-yellow hover:border-yellow hover:shadowYellow
        font-NT shadowPink text-8xl text-pink leading-4 text-center opacity-90 z-[2]"
          onClick={() => {
            setOnSave((prevState) =>
              prevState.spread.length > 28
                ? {
                    ...prevState,
                    spread: prevState.spread.slice(
                      0,
                      prevState.spread.length - 7
                    ),
                  }
                : prevState
            );
          }}
        >
          <AiOutlineMinus className="w-10 h-10 self-center" />
        </div>
      </div>
    </>
  );
}

export default Drag;
