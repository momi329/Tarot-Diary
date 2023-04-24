import { useParams } from "react-router-dom";
import Sun from "../images/Sun";
import Moon from "../images/Moon";
import cards from "../tarotcard/tarot-images";
import Star from "../images/Star";
function convertToRomanNumeral(num) {
  let roman = "";
  const romanNumeralMap = [
    { value: 1000, symbol: "M" },
    { value: 900, symbol: "CM" },
    { value: 500, symbol: "D" },
    { value: 400, symbol: "CD" },
    { value: 100, symbol: "C" },
    { value: 90, symbol: "XC" },
    { value: 50, symbol: "L" },
    { value: 40, symbol: "XL" },
    { value: 10, symbol: "X" },
    { value: 9, symbol: "IX" },
    { value: 5, symbol: "V" },
    { value: 4, symbol: "IV" },
    { value: 1, symbol: "I" },
  ];

  for (let i = 0; i < romanNumeralMap.length; i++) {
    while (num >= romanNumeralMap[i].value) {
      roman += romanNumeralMap[i].symbol;
      num -= romanNumeralMap[i].value;
    }
  }

  return roman;
}

const subTitle = " text-4xl text-pink font-NT shadowPink ";
function TarotCard() {
  const { id } = useParams();
  let tarot;
  if (id) {
    tarot = cards.cards[id];
  }
  return (
    <div className='w-screen  mx-auto flex items-center flex-col justify-center mb-[120px]'>
      <div className='w-screen h-[110px] mx-auto' />
      <div>這裡用來放導覽</div>
      <div
        className='w-[1200px] flex mx-auto mb-10
       items-center flex-row justify-center text-yellow'
      >
        {/* 上半部 */}
        <div className='flex flex-row gap-5 '>
          <img
            src={tarot.img}
            alt={tarot.name}
            className='w-[260px] rounded-xl opacity-85'
          />
        </div>
        <div className='flex flex-col justify-betweem h-[100%] ml-10'>
          <p className='text-4xl text-yellow font-NT shadowYellow mt-18'>
            {convertToRomanNumeral(Number(id))}
          </p>
          <h2
            className='text-4xl text-pink font-NT 
          shadowPink  mt-10 mb-4'
          >
            {tarot.name}
          </h2>
          <p>{tarot.arcana}</p>
        </div>
      </div>
      {/* 下半部 */}
      <div>
        {/* 關鍵字 */}
        <div className='flex items-center flex-col'>
          <h3 className={subTitle}>Keywords</h3>
          <div className='flex flex-row gap-8'>
            {tarot.keywords.map((keyword) => (
              <p
                className=' text-2xl text-yellow tracking-wider mt-3 font-NT shadowYellow capitalize'
                key={keyword}
              >
                {keyword}
              </p>
            ))}
          </div>
        </div>
        {/* 明亮面 */}
        <span>
          <div className='flex flex-row items-center gap-2 mt-10'>
            <Sun /> <p className={subTitle}>Lignt Meanings</p>
          </div>
          <div className='flex flex-col gap-2 mt-2 ml-[50px]'>
            {tarot.meanings.light.map((light) => (
              <p className='text-gray font-poppins font-light tracking-wider'>
                {light}
              </p>
            ))}
          </div>
        </span>
        <span>
          <div className='flex flex-row items-center gap-2 mt-10'>
            <Moon color={"#9F8761"} width={"38px"} height={"42px"} />{" "}
            <p className={subTitle}>Shadow Meanings</p>
          </div>
          <div className='flex flex-col gap-2 mt-2 ml-[50px]'>
            {tarot.meanings.shadow.map((shadow) => (
              <p className='text-gray font-poppins font-light tracking-wider'>
                {shadow}
              </p>
            ))}
          </div>
        </span>
        <span>
          <div className='flex flex-row items-center gap-2 mt-10 '>
            <Star color={"#9F8761"} />{" "}
            <p className={subTitle}>Question To Ask</p>
          </div>
          <div className='flex flex-col gap-2 mt-2 ml-[50px]'>
            {tarot.Questions_to_Ask.map((ask) => (
              <p className='text-gray font-poppins font-light tracking-wider'>
                {ask}
              </p>
            ))}
          </div>
        </span>
      </div>
    </div>
  );
}
export default TarotCard;
