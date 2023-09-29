import { Route, Routes, useNavigate } from 'react-router-dom'

import './App.css';
import ManageClient from './features/client/ManageClient';
import AllClients from './features/client/AllClients';


function App() {
    return (
        <div className="App">

            <Routes>
                <Route exact path='/manage-client' element={<ManageClient />} />
                <Route exact path='/all-clients' element={<AllClients />} />
            </Routes>
        </div>
    );
}

export default App;
