import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import isAuthenticated from './guards/AuthGuard';
import PaginaCliente from './components/PaginaCliente';
import PaginaAdmin from './components/PaginaAdmin';
import Login from './components/Login';



const RutaProtegidaCliente = () => {
    return isAuthenticated(0) ? <Outlet /> : <Navigate to="/" />;
};

const RutaProtegidaAdmin = () => {
    return isAuthenticated(1) ? <Outlet /> : <Navigate to="/" />;
};

const App = () => {
    return (
        <Router>
            <Fragment>
                <Routes>
                    <Route exact path="/" element={<Login/>} />
                    <Route exact path = '/cliente' element={<RutaProtegidaCliente/>}>
                        <Route exact path='/cliente' element={<PaginaCliente/>}/>
                    </Route>
                    <Route exact path = '/admin' element={<RutaProtegidaAdmin/>}>
                        <Route exact path='/admin' element={<PaginaAdmin/>}/>
                    </Route>
                </Routes>
            </Fragment>

        </Router>
    )
}

export default App;