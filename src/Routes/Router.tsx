import { BrowserRouter, Routes, Route } from "react-router-dom";
import Monstertransform from "~/components/monsters/MonsterTransform";
import NormalRoute from "./NormalRoute";
import Navbar from "~/components/Navbar/Navbar";
import Footer from "~/components/Footer/Footer";
import ItemsTransform from "~/components/items/ItemsTransform";

/* 
                                              COMENTARIOS 

Las rutas estan divididas en dos tipos:
Las privadas y las publicas, las privadas dependen de un token para funcionar, dicho token se optiene dentro del componente de verificationPage y luego es almacenado en el sessionStorage

*/
const Router = () => {
  return (
    <BrowserRouter>
    <Navbar/>
    <div style={{ padding:'126px 20px 20px 20px', }} className="route-body">

      <Routes >
        <Route element={<NormalRoute />}>
          <Route path="/" element={<Monstertransform />} />
          <Route path="/items" element={<ItemsTransform />} />

        </Route>

        <Route path="*" element={404} />
      </Routes>
    </div>
    <Footer/>

    </BrowserRouter>
  );
};

export default Router;
