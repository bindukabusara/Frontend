import Home from './components/Home';
import Signup from '../src/components/authentification/Signup'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';``
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../src/components/authentification/Login';
import Sidebar from '../src/components/Pharmacy/Sidebar/Sidebar'
import Dashboard from '../src/components/Content/Dashboard'
import MedicationStore from './components/Content/MedicationStore';
import ExpiringMedications from "./components/Content/ExpiringMedications";
import Navbar from "./components/Pharmacy/Sidebar/Navbar";
import ReportP from "./components/Content/ReportP";
import OrderPage from './components/Content/OrderPage';

// Patient side
import Dash from './componentp/contents/Dash';
import Card from './componentp/contents/Card';

//store side
import Store from './components/saler/Content/store';
import DashboardS from './components/saler/Content/DashboardS';
import ExpiringMedicationsS from "./components/saler/Content/ExpiringMedicationsS";
import ReportS from "./components/saler/Content/ReportS";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} index /> {/* Set Home as the default page */}
        <Route path='/navbar' element={<Navbar />} />
        <Route path='/home' element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/sidebar' element={<Sidebar />} />
        <Route path='/medications' element={<MedicationStore />} />
        <Route path="/expiring-medications" element={<ExpiringMedications />} />
        <Route path='/reportP' element={<ReportP/>}/>
        <Route path='/order' element={<OrderPage/>}/>

        <Route path='/dash' element={<Dash/>}/>
        <Route path='/card' element={<Card/>}/>

        <Route path='/store' element={<Store/>}/>
        <Route path="/dashboardS" element={<DashboardS />} />
        <Route path="/expiring-medicationsS" element={<ExpiringMedicationsS />} />
        <Route path='/reportS' element={<ReportS/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
