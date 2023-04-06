import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Member from "./pages/Member.tsx";
import Draggable from "./components/Draggable";
import Spread from "./pages/Spread";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/signin' element={<Member />} />
      <Route path='/design' element={<Draggable />} />
      <Route path='/spread/:id' element={<Spread />} />
    </Routes>
  </BrowserRouter>
);
