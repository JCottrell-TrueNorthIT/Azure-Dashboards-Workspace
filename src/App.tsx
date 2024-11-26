import './App.css';
import { ITile } from './interfaces/ITile';
import { getDashboards } from './dashboard-viewer/services/DashboardService';
import { useEffect, useState } from 'react';
import { IYamlDashboard } from './interfaces/IYamlDashboard';
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";

import './_reload.js';
import { Tile } from './dashboard-viewer/tiles/base/Tile';

function Dashboard() {
  const [dashboards, setDashboards] = useState<IYamlDashboard[]>()
  const params = useParams();
  useEffect(() => {
    getDashboards().then((d) => {
      setDashboards(d);
    });
  }, []);
  
  useEffect(() => {
    console.log(dashboards);
  }, [dashboards]);

  useEffect(() => {
    console.log(params);
  }, [params]);

  return (
    <div className="content">
      <base target="_blank"/>
      {
        dashboards
        ?.find(dashboard => dashboard.name.replace(/\s+/g, '') === params.dashboard)
        ?.tiles?.map((tile: ITile) => (
          <Tile tile={tile} />
        )) || <p>No dashboard found</p>
      }
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}  

export default App;
