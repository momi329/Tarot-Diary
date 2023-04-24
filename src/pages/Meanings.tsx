import Sun from "../images/Sun";
import Star from "../images/Star";
import Moon from "../images/Moon";
import cards from "../tarotcard/tarot-images";
import { useNavigate } from "react-router-dom";

const subTitle = " text-4xl text-pink font-NT shadowPink ";
function Meaning() {
  const navigate = useNavigate();
  const tarot = cards.coards;
  return (
    <>
      <div>
        <span>
          <div className='flex flex-row items-center gap-2 mt-10'>
            <Sun /> <p className={subTitle}>Major Arcana</p>
            {tarot.map((card, index) => (
              <img
                src={card.image}
                alt={card}
                className='w-20 h-20 rounded-full'
                onClick={() => navigate(`/card/${index}`)}
              />
            ))}
          </div>
        </span>
        <span>
          <div className='flex flex-row items-center gap-2 mt-10'>
            <Moon color={"#9F8761"} width={"38px"} height={"42px"} />{" "}
            <p className={subTitle}>Cups</p>
          </div>
        </span>
        <span>
          <div className='flex flex-row items-center gap-2 mt-10 '>
            <Star color={"#9F8761"} /> <p className={subTitle}>Swords</p>
          </div>
        </span>
        <span>
          <div className='flex flex-row items-center gap-2 mt-10 '>
            <Star color={"#9F8761"} /> <p className={subTitle}>Wands</p>
          </div>
        </span>
        <span>
          <div className='flex flex-row items-center gap-2 mt-10 '>
            <Star color={"#9F8761"} /> <p className={subTitle}>Pentacles</p>
          </div>
        </span>
      </div>
    </>
  );
}
export default Meaning;
