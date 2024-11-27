import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";

import './_reload.js';
import { Dashboard } from './dashboard-viewer/dashboard/dashboard';
import { IYamlDashboard } from './interfaces/IYamlDashboard';
import { DashboardService } from './dashboard-viewer/services/DashboardService';
import { useEffect, useState } from 'react';

function DashboardWrapper(props: {dashboards: IYamlDashboard[]}) {
  const { dashboardName } = useParams();

  const dashboard = props.dashboards.find((d) => d.name === dashboardName?.replaceAll("-", " "));

  if (!dashboard) {
    return <h1>No Dashboard Found</h1>;
  }

  return <Dashboard dashboard={dashboard} />
}

function App() {
  const [dashboards, setDashboards] = useState<IYamlDashboard[]>([]);
  
  useEffect(() => {
    DashboardService.getDashboards().then((d) => setDashboards(d));
  }, []);

  const mainName = dashboards.find((d) => d.isMain)?.name.replaceAll(" ", "-");

  return (
    <div className="content">
      {!!dashboards.length && <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={`/${mainName}`} replace />} />
          <Route path="/:dashboardName" element={<DashboardWrapper dashboards={dashboards}/>} />
        </Routes>
      </BrowserRouter>}
    </div>
  );
}  

export default App;
