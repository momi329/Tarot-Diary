import { Link } from "react-router-dom";
import "../index.css";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";

const headerItems = (isLogin: boolean, userUID: string) => [
  { title: "Tarot Meanings", link: "/meanings" },
  { title: "Personal Page", link: `/profile/${userUID}` },
  { title: `${isLogin ? "Sign Out" : "Log In"}`, link: "/signin" },
  { title: "About Us", link: "/aboutus" },
];
function Header() {
  const { isLogin, user, userUID, signOut, signIn } = useContext(AuthContext);

  return (
    <div className='h-[70px] w-screen flex flex-row items-center  justify-between fixed z-10'>
      <div className='h-[70px] w-screen fixed top-0 right-0 bg-black opacity-20'></div>
      <div
        className='w-[105px] h-[60px] text-white text-2xl font-sygma text-center  
      tracking-wider z-10 ml-16 '
      >
        <p className='shadowWhite'></p>TAROT
        <p className='tracking-widest shadowWhite'>DIARY</p>
      </div>
      <div className='flex flex-row gap-16 text-ml tracking-widest font-sygma font-bold text-center text-yellow z-10 mr-16 '>
        {headerItems(isLogin, userUID).map((item, index) => (
          <Link to={item.link}>
            <div className='hover:border-b pb-[0.3px] shadowYellow' key={index}>
              {item.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
export default Header;
