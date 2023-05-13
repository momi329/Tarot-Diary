import MyImages from "../../components/MyImages";

function NewSpreadDetails({ inputChange, onSave, setOnSave }) {
  return (
    <div className="flex flex-row gap-9 mb-14">
      <form className="flex flex-col gap-2 w-2/5 justify-between">
        <h1 className="font-NTalt text-yellow text-4xl mt-10 mb-10 tracking-wide font-medium">
          Pick {onSave.spread.filter((curr) => curr !== 0).length}
          {onSave.spread.filter((curr) => curr !== 0).length === 1
            ? "Card"
            : "Cards"}
        </h1>
        <div className="relative group">
          <div className="absolute bottom-0 h-[2px] bg-yellow/50 w-0 group-hover:w-full duration-500"></div>
          <input
            className="w-[100%] pl-2 pb-4  border-yellow  text-yellow bg-pink/40 pt-1
              tracking-wider placeholder:text-gray placeholder:opacity-75  hover:bg-pink/0 duration-500  "
            type="text"
            name="title"
            maxLength={30}
            placeholder="請輸入你的標題"
            value={onSave.title}
            onChange={(e) => inputChange(e, "title")}
          />
        </div>
        <div className="relative group">
          <div className="absolute bottom-0 h-[2px] bg-yellow/50 w-0 group-hover:w-full duration-500"></div>
          <textarea
            className="w-[100%] h-[130px] pl-2 pb-14 text-yellow bg-pink/40 pt-1 outline outline-0
               border-yellow  tracking-wider placeholder:text-gray placeholder:opacity-75 hover:bg-pink/0 duration-500"
            name="description"
            placeholder="請描述一下此牌陣的用法"
            value={onSave.description}
            onChange={(e) => inputChange(e, "description")}
          />
        </div>
      </form>
      <div className="order-2 w-3/5">
        <MyImages onSave={onSave} setOnSave={setOnSave} />
      </div>
    </div>
  );
}
export default NewSpreadDetails;
