import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, ScatterChart, Scatter, Treemap, RadialBarChart, RadialBar, PolarAngleAxis as RadialAngleAxis
} from 'recharts';

const Results = ({ data, sql }) => {
  const [chartType, setChartType] = useState("Bar");
  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");

  useEffect(() => {
    if (data && data.length > 0) {
      const keys = Object.keys(data[0]);
      const stringKeys = keys.filter(k => typeof data[0][k] === "string");
      const numberKeys = keys.filter(k =>
        typeof data[0][k] === "number" || !isNaN(Number(data[0][k]))
      );

      setXKey(stringKeys[0] || keys[0]);
      setYKey(numberKeys[0] || keys[1]);
    }
  }, [data]);

  if (!data || data.length === 0) return null;

  const handleChartTypeChange = (e) => setChartType(e.target.value);

  const renderTable = () => (
    <table className="min-w-full table-auto mt-4">
      <thead className="bg-gray-200">
        <tr>
          {Object.keys(data[0]).map((col, idx) => (
            <th key={idx} className="px-4 py-2 text-left text-sm font-semibold text-gray-600">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="border-t border-gray-200">
            {Object.values(row).map((val, i) => (
              <td key={i} className="px-4 py-2 text-sm text-gray-800">{val}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderBarOrLineChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      {chartType === "Bar" ? (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={yKey} fill="#8884d8" />
        </BarChart>
      ) : (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={yKey} stroke="#82ca9d" />
        </LineChart>
      )}
    </ResponsiveContainer>
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          dataKey={yKey}
          nameKey={xKey}
          cx="50%"
          cy="50%"
          outerRadius={150}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );

  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey={yKey} stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderRadarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart outerRadius={150} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey={xKey} />
        <PolarRadiusAxis />
        <Radar dataKey={yKey} stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  );

  const renderComposedChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={yKey} fill="#8884d8" />
        <Line type="monotone" dataKey={yKey} stroke="#ff7300" />
      </ComposedChart>
    </ResponsiveContainer>
  );

  const renderScatterChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart>
        <CartesianGrid />
        <XAxis dataKey={xKey} name={xKey} />
        <YAxis dataKey={yKey} name={yKey} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="Data" data={data} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );

  const renderTreemap = () => (
    <ResponsiveContainer width="100%" height={400}>
      <Treemap
        data={data}
        dataKey={yKey}
        nameKey={xKey}
        ratio={4/3}
        stroke="#fff"
        fill="#8884d8"
      />
    </ResponsiveContainer>
  );

  const renderRadialBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="10%"
        outerRadius="80%"
        barSize={10}
        data={data}
      >
        <RadialAngleAxis dataKey={xKey} />
        <RadialBar minAngle={15} background clockWise dataKey={yKey} fill="#8884d8" />
        <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" align="center" />
        <Tooltip />
      </RadialBarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">📊 Query Results</h2>

      {sql && (
        <div className="mb-4 text-sm text-gray-600">
          <strong>SQL Query:</strong> <code className="break-all">{sql}</code>
        </div>
      )}

      <div className="mb-4 flex space-x-4">
        <label>Chart Type:</label>
        <select value={chartType} onChange={handleChartTypeChange}>
          <option value="Bar">Bar</option>
          <option value="Line">Line</option>
          <option value="Pie">Pie</option>
          <option value="Area">Area</option>
          <option value="Radar">Radar</option>
          <option value="Composed">Composed</option>
          <option value="Scatter">Scatter</option>
          <option value="Treemap">Treemap</option>
          <option value="RadialBar">RadialBar</option>
        </select>
      </div>

      {renderTable()}

      <div className="mt-6">
        {chartType === "Bar" && renderBarOrLineChart()}
        {chartType === "Line" && renderBarOrLineChart()}
        {chartType === "Pie" && renderPieChart()}
        {chartType === "Area" && renderAreaChart()}
        {chartType === "Radar" && renderRadarChart()}
        {chartType === "Composed" && renderComposedChart()}
        {chartType === "Scatter" && renderScatterChart()}
        {chartType === "Treemap" && renderTreemap()}
        {chartType === "RadialBar" && renderRadialBarChart()}
      </div>
    </div>
  );
};

export default Results;
