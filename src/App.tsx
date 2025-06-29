import { BrowserRouter, Routes, Route } from "react-router"; // make sure it's "react-router-dom", not just "react-router"
import Landing from "./Components/Landing";
import Auth from "./Components/Authentication/Auth";
import Products from "./Components/Stocks/Products";
import Product from "./Components/Stocks/Product";
import Admin from "./Components/Management/Admin";
import Payment from "./Components/Order-Payment/Payment";
import CreateOrder from "./Components/Order-Payment/Order";
import GlobalProducts from "./Components/Stocks/Global";
import BranchAdmin from "./Components/Management/Branch";
import UserSettings from "./Components/Management/User";
import NotFound from "./NotFound";
import EditProduct from "./Components/Stocks/EditProduct";
import AddProduct from "./Components/Stocks/AddProduct";

const App = (): React.ReactNode => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/global" element={<GlobalProducts />} />
        <Route path="/products/:id" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/management/admin" element={<Admin />} />
        <Route path="/management/branch/:id" element={<BranchAdmin />} />
        <Route path="/management/user/:id" element={<UserSettings />} />
        <Route path="/management/product/:id" element={<EditProduct />} />
        <Route path="/management/:branchid/add" element={<AddProduct />} />
        <Route path="/orders" element={<CreateOrder />} />
        <Route path="/payments" element={<Payment />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
