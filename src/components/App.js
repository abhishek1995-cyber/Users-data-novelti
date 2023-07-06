import Create from "./Create";
import Dashboard from "./Dashborad";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Dashboard />} />
          <Route path="/create" exact element={<Create  />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
