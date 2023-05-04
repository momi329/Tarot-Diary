import { Link, useNavigate, useLocation } from "react-router-dom";
import "../index.css";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";
import UnderlineButton from "./UnderlineButton";
import { getAuth } from "firebase/auth";
import Alert from "./Alert";
function Header() {
  const { isLogin, userUID, signOut, setAlert, alert } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const headerItems = (isLogin: boolean, userUID: string) => [
    { title: "Tarot Meanings", link: "/meanings", route: "meanings" },
    {
      title: "Personal Page",
      link: `/profile/${userUID}`,
      route: `/profile/${userUID}`,
    },
    {
      title: "Tarot Divination",
      link: "/divination",
      route: "divination",
    },
  ];

  return (
    <>
      {alert && (
        <Alert
          value={"You're already Log Out!"}
          buttonValue={[
            { value: "Confirm", action: () => setAlert(false), type: "little" },
          ]}
        />
      )}
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
          {headerItems(isLogin, userUID).map((item, index) => {
            return (
              <Link to={item.link}>
                <UnderlineButton
                  value={item.title}
                  icon={""}
                  type={"header"}
                  key={index}
                  action={() => {}}
                  selected={location.pathname.includes(`${item.route}`)}
                />
              </Link>
            );
          })}
          {isLogin ? (
            <UnderlineButton
              value={"Log Out"}
              icon={""}
              type={"header"}
              action={() => signOut(auth)}
              selected={location.pathname.includes("signin")}
            />
          ) : (
            <UnderlineButton
              value={"Log In"}
              icon={""}
              type={"header"}
              action={() => {
                navigate("/signin");
              }}
              selected={location.pathname.includes("signin")}
            />
          )}
        </div>
      </div>
    </>
  );
}
export default Header;
