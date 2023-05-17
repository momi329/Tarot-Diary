import { getAuth } from "firebase/auth";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import "../index.css";
import Alert from "./Alert";
import UnderlineButton from "./UnderlineButton";
function Header() {
  const { isLogin, userUID, signOut, setAlert, alert } =
    useContext(AuthContext);
  const [openHamburger, setOpenHamburger] = useState(false);
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
      <div className=" h-[70px] w-screen flex flex-row items-center  justify-between fixed z-20">
        <div className="h-[70px] w-screen fixed top-0 right-0 bg-black opacity-20 tracking-widest"></div>
        <div
          className="w-[105px] h-[60px] text-yellow text-2xl font-NT text-center 
          tracking-wider z-10 ml-16 cursor-pointer 
          sm:ml-[2%] sm:text-xl sm:h-[50px]"
        >
          <Link to={"/"}>
            <p
              className={`shadowYellow cursor-pointer ${
                openHamburger ? "hidden" : ""
              }`}
            >
              TAROT
            </p>
            <p
              className={`shadowYellow cursor-pointer ${
                openHamburger ? "hidden" : ""
              }`}
            >
              DIARY
            </p>
          </Link>
        </div>
        <div className="hidden sm:block  mr-[4%] ">
          <div
            className=" z-20 relative flex items-center w-[32px] h-[15px] justify-between flex-col cursor-pointer  "
            onClick={() => {
              setOpenHamburger(!openHamburger);
            }}
          >
            <div
              className={`h-[0.8px] w-full bg-yellow origin-center duration-300 ${
                openHamburger ? "rotate-[30deg] w-[30px] absolute top-1/2 " : ""
              }`}
            />
            <div
              className={`h-[0.8px] w-full bg-yellow duration-500 ${
                openHamburger ? "hidden " : ""
              }`}
            />
            <div
              className={`h-[0.8px] w-full bg-yellow origin-center duration-300 ${
                openHamburger
                  ? "rotate-[-30deg] w-[30px] absolute top-1/2 bg-black"
                  : ""
              }`}
            />
          </div>
          <div
            className={`${
              openHamburger ? "h-screen opacity-95" : ""
            } w-screen h-0 bg-black fixed  top-0 left-0  duration-500 opacity-0 flex flex-col gap-4`}
          >
            <div
              className={`ml-[8%] mt-28 flex flex-col gap-14 tracking-widest duration-1000 ${
                openHamburger ? " opacity-100" : "opacity-0 hidden"
              }`}
            >
              {headerItems(isLogin, userUID).map((item, index) => {
                return (
                  <Link to={item.link} key={index}>
                    <div className="font-NT text-pink shadowBlack text-4xl">
                      {item.title}
                    </div>
                  </Link>
                );
              })}
              {isLogin ? (
                <div
                  className="font-NT text-pink shadowBlack text-4xl"
                  onClick={() => signOut(auth)}
                >
                  Log Out
                </div>
              ) : (
                <div
                  className="font-NT text-pink shadowBlack text-4xl"
                  onClick={() => {
                    navigate("/signin");
                  }}
                >
                  Log In
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="sm:hidden flex flex-row gap-16 text-lg tracking-widest font-NT text-center text-yellow z-10 mr-16 ">
          {headerItems(isLogin, userUID).map((item, index) => {
            return (
              <Link to={item.link} key={index}>
                <UnderlineButton
                  value={item.title}
                  icon={""}
                  type={"header"}
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
