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

  return (
    <div className="content">
      <base target="_blank"/>
      {
        dashboards?.find((dashboard) => {
          const dashboardEnvName = Object.keys(process.env)
            .filter(key => key.startsWith("REACT_APP_URI")) 
            .find(key => process.env[key] === params.dashboard); 
          if (dashboardEnvName) {
            const dashboardName = dashboardEnvName
              .replace("REACT_APP_URI_", "") 
              .toLowerCase()
              .split("_") 
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
            console.log(dashboardName);  
            return dashboardName === dashboard.name;  
          }    
          return false; 
        })
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
