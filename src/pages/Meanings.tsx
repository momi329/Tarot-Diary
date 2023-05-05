import Sun from "../images/Sun";
import Star from "../images/Star";
import Moon from "../images/Moon";
import cards from "../tarotcard/tarot-images";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
const subTitle = " text-5xl text-pink font-NT shadowPink mt-1 mb-10";
function Meaning() {
  const navigate = useNavigate();
  const tarot = cards.cards;

  return (
    <div className='w-screen h-[110px] min-h-[90%]'>
      <div className='w-[944px] mx-auto pb-48 mt-20'>
        <span>
          <div className='flex flex-col flex-wrap items-center gap-2  font-NT '>
            <Sun /> <p className={subTitle}>Major Arcana</p>
            <div className='flex flex-row flex-wrap gap-4 justify-start mt-8'>
              {tarot.map(
                (card, index) =>
                  index < 22 && (
                    <div
                      className='flex flex-col items-center w-[120px] mt-4'
                      key={index}
                    >
                      <img
                        src={card.img}
                        alt={card.name}
                        className='w-20 h-20 rounded-full object-cover contrast-50 hover:filter-none object-top
                        duration-300 hover:scale-110 cursor-pointer hover:object-center'
                        onClick={() => navigate(`/card/${index}`)}
                      />
                      <p
                        className=' cursor-pointer font-NT 
                      text-yellow shadowYellow text-center tracking-widest text-base mt-2 font-medium'
                      >
                        {card.name}
                      </p>
                    </div>
                  )
              )}
            </div>
          </div>
        </span>
        <span>
          <div className='flex flex-col flex-wrap items-center gap-2  font-NT '>
            <Moon color={"#9F8761"} width={"38px"} height={"42px"} />{" "}
            <p className={subTitle}>Cups</p>
            <div className='flex flex-row flex-wrap gap-4 justify-start mt-8'>
              {tarot.map(
                (card, index) =>
                  index > 21 &&
                  index < 36 && (
                    <div
                      className='flex flex-col items-center w-[120px] mt-4'
                      key={index}
                    >
                      <img
                        src={card.img}
                        alt={card.name}
                        className='w-20 h-20 rounded-full object-cover contrast-50 hover:filter-none object-top
                        duration-300 hover:scale-110 cursor-pointer hover:object-center'
                        onClick={() => navigate(`/card/${index}`)}
                      />
                      <p
                        className=' cursor-pointer font-NT 
                      text-yellow shadowYellow text-center tracking-widest text-base mt-2 font-medium'
                      >
                        {card.name}
                      </p>
                    </div>
                  )
              )}
            </div>
          </div>
        </span>
        <span>
          <div className='flex flex-col flex-wrap items-center gap-2 mt-10 font-NT '>
            <Star color={"#9F8761"} /> <p className={subTitle}>Swords</p>
            <div className='flex flex-row flex-wrap gap-4 justify-start mt-8'>
              {tarot.map(
                (card, index) =>
                  index > 35 &&
                  index < 50 && (
                    <div
                      className='flex flex-col items-center w-[120px] mt-4'
                      key={index}
                    >
                      <img
                        src={card.img}
                        alt={card.name}
                        className='w-20 h-20 rounded-full object-cover contrast-50 hover:filter-none object-top
                        duration-300 hover:scale-110 cursor-pointer hover:object-center'
                        onClick={() => navigate(`/card/${index}`)}
                      />
                      <p
                        className=' cursor-pointer font-NT 
                      text-yellow shadowYellow text-center tracking-widest text-base mt-2 font-medium'
                      >
                        {card.name}
                      </p>
                    </div>
                  )
              )}
            </div>
          </div>
        </span>
        <span>
          <div className='flex flex-col flex-wrap items-center gap-2 mt-10 font-NT '>
            <Star color={"#9F8761"} /> <p className={subTitle}>Wands</p>
            <div className='flex flex-row flex-wrap gap-4 justify-start mt-8'>
              {tarot.map(
                (card, index) =>
                  index > 50 &&
                  index < 64 && (
                    <div
                      className='flex flex-col items-center w-[120px] mt-4'
                      key={index}
                    >
                      <img
                        src={card.img}
                        alt={card.name}
                        className='w-20 h-20 rounded-full object-cover contrast-50 hover:filter-none object-top
                        duration-300 hover:scale-110 cursor-pointer hover:object-center'
                        onClick={() => navigate(`/card/${index}`)}
                      />
                      <p
                        className=' cursor-pointer font-NT 
                      text-yellow shadowYellow text-center tracking-widest text-base mt-2 font-medium'
                      >
                        {card.name}
                      </p>
                    </div>
                  )
              )}
            </div>
          </div>
        </span>
        <span>
          <div className='flex flex-col flex-wrap items-center gap-2 mt-10 font-NT '>
            <Star color={"#9F8761"} /> <p className={subTitle}>Pentacles</p>
            <div className='flex flex-row flex-wrap gap-4 justify-start mt-8'>
              {tarot.map(
                (card, index) =>
                  index > 64 &&
                  index < 78 && (
                    <div
                      className='flex flex-col items-center w-[120px] mt-4'
                      key={index}
                    >
                      <img
                        src={card.img}
                        alt={card.name}
                        className='w-20 h-20 rounded-full object-cover contrast-50 hover:filter-none object-top
                        duration-300 hover:scale-110 cursor-pointer hover:object-center'
                        onClick={() => navigate(`/card/${index}`)}
                      />
                      <p
                        className=' cursor-pointer font-NT 
                      text-yellow shadowYellow text-center tracking-widest text-base mt-2 font-medium'
                      >
                        {card.name}
                      </p>
                    </div>
                  )
              )}
            </div>
          </div>
        </span>
      </div>
      <Footer />
    </div>
  );
}
export default Meaning;
