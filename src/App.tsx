import './App.css';
import { ITile } from './interfaces/ITile';
import { DashboardService } from './dashboard-viewer/services/DashboardService';
import { useEffect, useState } from 'react';
import { IYamlDashboard } from './interfaces/IYamlDashboard';

import './_reload.js';
import { Tile } from './dashboard-viewer/tiles/base/Tile';

function App() {
  const [dashboard, setDashboard] = useState<IYamlDashboard>();

  useEffect(() => {
    DashboardService.getDashboard().then((d) => setDashboard(d));
  }, []);

  return (
    <div className="content">
      <base target="_bank"/>
      {
        dashboard?.tiles.map((tile: ITile) => {
          return <Tile tile={tile}/>
        })
      }
    </div>
  );
}

export default App;
