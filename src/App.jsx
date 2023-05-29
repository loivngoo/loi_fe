import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Fragment, useEffect, useRef } from 'react';

import DefaultLayout from '@src/components/DefaultLayout';
import { publicRoutes } from './routes';
import socketIOClient from 'socket.io-client';

function App() {
    return (
        <Router>
            <Routes>
                {publicRoutes.map((route, index) => {
                    let Layout = DefaultLayout;
                    if (!route.layout) Layout = Fragment;
                    const Page = route.component;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page link={route.path} layout={route.layout} isLogin={route.isLogin} />
                                </Layout>
                            }
                            exact
                        />
                    );
                })}
            </Routes>
        </Router>
    );
}

export default App;
