import { JSX } from "react/jsx-runtime";
import { TileContents } from "../base/TileContents";
import Chart from 'react-apexcharts';
import './ChartContents.css';
import { getMetricData } from "../../services/MonitorService";
import { ITimeSeriesDataPoint } from "../../../interfaces/Shared";
import { MetricsContent } from "../../../interfaces/content/MetricsContent";

export class ChartContents extends TileContents<MetricsContent, {data: ITimeSeriesDataPoint[]}> {

  private series: () => Promise<ITimeSeriesDataPoint[]>;

  constructor(props: {content: MetricsContent}) {
    super(props);
    this.series = () => getMetricData(props.content);
    this.state = {data: []};
  }

  render(): JSX.Element {
      if (this.state.data.length === 0) {
        this.series().then((data) => {
          this.setState({data: data});
        });
      }

      var options: ApexCharts.ApexOptions = {
          chart: {
            id: 'line'
          },
          xaxis: {
            type: 'datetime',
            
          },
          stroke: {
            width: 2
          }
        }

      var data =[
          {
            name: "series-1",
            data: this.state.data
          }

        ]

      return <Chart className="chart-img" options={options} type="line" series={data} height={"90%"}></Chart>
  }

}