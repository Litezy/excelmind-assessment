import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthPages, GeneralPages } from "./pageLinks";
import AuthGuard from "./auth/AuthGuard";

const App = () => {


  return (
    <BrowserRouter>
      <Routes>
        {GeneralPages.map((item, index) => (
          <Route key={index} path={item.path} element={<item.component />} />
        ))}
        {AuthPages.map((item, index) => (
          <Route key={index} path={item.path} element={<AuthGuard><item.component /></AuthGuard>} />
        ))}

      </Routes>
    </BrowserRouter>
  )
}

export default App