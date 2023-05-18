type ButtonType = {
  type: string;
  value: string;
  action: () => void | object;
  disabled?: boolean;
  url?: string;
};

function Button({ type, value, action, disabled }: ButtonType) {
  let style =
    `${disabled ? `cursor-not-allowed` : `cursor-pointer`}` +
    " font-NT  text-center  tracking-wider capitalize hover:animate-pulse " +
    " leading-8   rounded-[50%]  border-[2px] bg-black/30 backdrop-blur-sm";
  const pinkAndYellow =
    " text-pink border-pink shadowPink hover:bg-pink " +
    " hover:border-yellow hover:text-yellow hover:bg-opacity-50";
  const pinkAndGreen =
    " text-gold border-gold shadowGold hover:bg-green  " +
    " hover:border-gold hover:text-gold hover:bg-opacity-50";
  if (type === "small") {
    style += ` w-[185px] h-[65px] text-xl ${pinkAndYellow}`;
  } else if (type === "big") {
    style += ` w-[100%] h-[78px] text-2xl leading-[23px]${pinkAndYellow}`;
  } else if (type === "tiny") {
    style += ` w-2/12 h-2/12 text-base text-xl ${pinkAndYellow}`;
  } else if (type === "little") {
    style += ` w-[120px] h-[40px] text-xl ${pinkAndGreen}`;
  } else if (type === "littlePink") {
    style += ` w-[120px] h-[40px] text-xl ${pinkAndYellow}`;
  }
  return (
    <button
      className={style}
      onClick={() => {
        action();
      }}
      disabled={disabled}
    >
      <div
        className={`${
          type === "little" || type === "littlePink" ? "mt-1" : "mt-2"
        }`}
      >
        {value}
      </div>
    </button>
  );
}
export default Button;
