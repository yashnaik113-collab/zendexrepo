import React from "react";
import { BrowserRouter } from "react-router-dom";
import MyDashboard from "./modules/MyDashboard";

function App() {
  return (
    <BrowserRouter>
      <MyDashboard />
    </BrowserRouter>
  );
}

export default App;
