function Button({ type, value, action }) {
  let style =
    "font-sygma  text-center  tracking-wider " +
    "leading-8   rounded-[50%]  border-[1.5px] ";
  const pinkAndYellow =
    "text-pink border-pink shadowPink hover:bg-pink  pb-1" +
    " hover:border-yellow hover:text-yellow hover:bg-opacity-50";
  const pinkAndGreen =
    "text-gold border-gold shadowGold hover:bg-green  " +
    " hover:border-gold hover:text-gold hover:bg-opacity-50";
  if (type === "small") {
    style += " w-[185px] h-[65px] text-xl " + pinkAndYellow;
  } else if (type === "big") {
    style += " w-[230px] h-[73px] text-xl " + pinkAndYellow;
  } else if (type === "tiny") {
    style += " w-2/12 h-2/12 text-base " + pinkAndYellow;
  } else if (type === "little") {
    style += " w-[120px] h-[40px] text-base " + pinkAndGreen;
  }
  return (
    <button className={style} onClick={() => action()}>
      <div className='mt-2'>{value}</div>
    </button>
  );
}
export default Button;
