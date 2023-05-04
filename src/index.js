import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Member from "./pages/Member.tsx";
import Draggable from "./pages/Draggable";
import Spread from "./pages/Spread/Spread";
import TarotCard from "./pages/TarotCard";
import Divine from "./pages/Spread/Divine";
import AskGPT from "./components/AksGPT";
import Profile from "./pages/Profile/Profile";
import Meaning from "./pages/Meanings";
import Divination from "./pages/Divination";
import Home from "./pages/Home/Home";
import { AuthContextProvider } from "./context/authContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<Home />} />
        <Route path='/signin' element={<Member />} />
        <Route path='/profile/:uid' element={<Profile />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/design' element={<Draggable />} />
        <Route path='/spread/:id' element={<Spread />} />
        <Route path='/card/:id' element={<TarotCard />} />
        <Route path='/divine' element={<Divine />} />
        <Route path='/ask' element={<AskGPT />} />
        <Route path='/meanings' element={<Meaning />} />
        <Route path='/divination' element={<Divination />} />
        {/* <Route path='*' element={<Navigate to='/' replace />} /> */}
      </Route>
    </Routes>
  </BrowserRouter>
);
