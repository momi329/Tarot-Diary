import { Link } from "react-router-dom";
import "../index.css";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";

const headerItems = (isLogin: boolean, userUID: string) => [
  { title: "Tarot Meanings", link: "/meanings" },
  { title: "Personal Page", link: `/profile/${userUID}` },
  { title: `${isLogin ? "Sign Out" : "Log In"}`, link: "/signin" },
  { title: "Tarot Divination", link: "/divination" },
];
function Header() {
  const { isLogin, user, userUID, signOut, signIn } = useContext(AuthContext);

  return (
    <div className='h-[70px] w-screen flex flex-row items-center  justify-between fixed z-10'>
      <div className='h-[70px] w-screen fixed top-0 right-0 bg-black opacity-20 tracking-widest'></div>
      <div
        className='w-[105px] h-[60px] text-yellow text-2xl font-NT text-center 
      tracking-wider z-10 ml-16 '
      >
        <Link to={"/"}>
          <p className='shadowYellow'>TAROT</p>
          <p className=' shadowYellow'>DIARY</p>
        </Link>
      </div>
      <div className='flex flex-row gap-16 text-lg tracking-widest font-NT text-center text-yellow z-10 mr-16 '>
        {headerItems(isLogin, userUID).map((item, index) => (
          <Link to={item.link}>
            <div
              className='hover:underline-offset-2 pb-[0.3px] shadowYellow'
              key={item.title}
            >
              {item.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
export default Header;
