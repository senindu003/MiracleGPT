// src/App.jsx
import React from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PdfPreviewPage from "./subcomponents/PdfPreviewPage";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/pdf_preview" element={<PdfPreviewPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
