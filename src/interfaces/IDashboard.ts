export interface IDashboard {
    properties: IDashboardProperties;
    name: string;
    type: string;
    location: string;
    tags: {
      "hidden-title": string;
    };
    apiVersion: string;
  }
  
  export interface IDashboardProperties {
    lenses: IDashboardLens[];
    metadata: IDashboardMetadata;
  }
  
  export interface IDashboardLens {
    order: number;
    parts: IDashboardPart[];
  }
  
  export interface IDashboardPart {
    position: IDashboardPosition;
    metadata: IDashboardMetadataContent;
  }
  
  export interface IDashboardPosition {
    x: number;
    y: number;
    colSpan: number;
    rowSpan: number;
  }
  
  export interface IDashboardMetadataContent {
    inputs: IDashboardInput[];
    type: string;
    settings: IDashboardSettings;
    partHeader?: IDashboardPartHeader;
  }
  
  export interface IDashboardInput {
    name: string;
    isOptional: boolean;
    value?: any;
  }
  
  export interface IDashboardSettings {
    content: IDashboardContent;
  }
  
  export interface IDashboardContent {
    content?: string;
    title?: string;
    subtitle?: string;
    markdownSource?: number;
    markdownUri?: string;
    options?: IDashboardChartOptions;
    GridColumnsWidth?: Record<string, string>;
    Query?: string;
    ControlType?: string;
    SpecificChart?: string;
    PartTitle?: string;
    PartSubTitle?: string;
    Dimensions?: IDashboardDimensions;
    LegendOptions?: IDashboardLegendOptions;
  }
  
  export interface IDashboardChartOptions {
    chart: IDashboardChart;
  }
  
  export interface IDashboardChart {
    metrics: IDashboardMetric[];
    title: string;
    titleKind: number;
    visualization: IDashboardVisualization;
  }
  
  export interface IDashboardMetric {
    resourceMetadata: {
      id: string;
    };
    name: string;
    aggregationType: number;
    namespace: string;
    metricVisualization?: IDashboardMetricVisualization;
  }
  
  export interface IDashboardMetricVisualization {
    displayName: string;
    resourceDisplayName?: string;
    color?: string;
  }
  
  export interface IDashboardVisualization {
    chartType: number;
    legendVisualization: IDashboardLegendVisualization;
    axisVisualization: IDashboardAxisVisualization;
    disablePinning: boolean;
  }
  
  export interface IDashboardLegendVisualization {
    isVisible: boolean;
    position: number;
    hideHoverCard: boolean;
    hideLabelNames: boolean;
  }
  
  export interface IDashboardAxisVisualization {
    x: IDashboardAxis;
    y: IDashboardAxis;
  }
  
  export interface IDashboardAxis {
    isVisible: boolean;
    axisType: number;
  }
  
  export interface IDashboardDimensions {
    xAxis: IDashboardDimensionAxis;
    yAxis: IDashboardDimensionAxis[];
    splitBy?: any[];
    aggregation?: string;
  }
  
  export interface IDashboardDimensionAxis {
    name: string;
    type: string;
  }
  
  export interface IDashboardLegendOptions {
    isEnabled: boolean;
    position: string;
  }
  
  export interface IDashboardPartHeader {
    title: string;
    subtitle: string;
  }
  
  export interface IDashboardMetadata {
    model: IDashboardModel;
  }
  
  export interface IDashboardModel {
    timeRange: IDashboardTimeRange;
    filterLocale: IDashboardFilterLocale;
    filters: IDashboardFilters;
  }
  
  export interface IDashboardTimeRange {
    value: {
      relative: {
        duration: number;
        timeUnit: number;
      };
    };
    type: string;
  }
  
  export interface IDashboardFilterLocale {
    value: string;
  }
  
  export interface IDashboardFilters {
    value: {
      MsPortalFx_TimeRange: IDashboardMsPortalFxTimeRange;
    };
  }
  
  export interface IDashboardMsPortalFxTimeRange {
    model: {
      format: string;
      granularity: string;
      relative: string;
    };
    displayCache: {
      name: string;
      value: string;
    };
    filteredPartIds: string[];
  }
  