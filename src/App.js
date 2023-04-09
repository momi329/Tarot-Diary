import "./index.css";
import { Outlet } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext";
function App() {
  return (
    <>
      <AuthContextProvider>
        <Outlet />
      </AuthContextProvider>
    </>
  );
}

export default App;
