import { useState, useEffect, useRef } from "react";
import "./App.css";
import Loader from "./Loader";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell, CartesianGrid, Legend, BarChart, Bar
} from "recharts";

const BUILDING_NAMES = {
  1: "Admin Block",
  2: "CSE Block",
  3: "ECE Block",
  4: "Mechanical Block",
  5: "Library",
  6: "Hostel",
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "rgba(13,17,23,0.96)",
        border: "1px solid rgba(0,255,178,0.2)",
        borderRadius: 8,
        padding: "10px 14px",
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.75rem",
      }}
    >
      <p style={{ color: "#7A9AAE", marginBottom: 4 }}>
        {label}
      </p>

      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value} kW
        </p>
      ))}
    </div>
  );
};

export default function EnergyDashboard() {
  // const THRESHOLD = 80;

  const dashboardRef = useRef(null);
  const analyticsRef = useRef(null);
  const sensorsRef = useRef(null);
  const alertsRef = useRef(null);

  const navItems = [
    "Dashboard",
    "Analytics",
    "Sensors",
    "Alerts",
  ];

  const scrollToSection = (ref, nav) => {
    setActiveNav(nav);

    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  // const PIPELINE = [
  //   {
  //     label: "Data Generation",
  //     sub: "Sensors / Simulated Input",
  //     state: "done",
  //   },
  //   {
  //     label: "Send to Backend (API)",
  //     sub: "REST → Cloud",
  //     state: "done",
  //   },
  //   {
  //     label: "Validation & Analysis",
  //     sub: "Processing & cleaning",
  //     state: "done",
  //   },
  //   {
  //     label: "Store in Cloud DB",
  //     sub: "PostgreSQL",
  //     state: "active",
  //   },
  //   {
  //     label: "Fetch for Dashboard",
  //     sub: "API pull",
  //     state: "pending",
  //   },
  //   {
  //     label: "Display Charts / KPIs",
  //     sub: "Visualization layer",
  //     state: "pending",
  //   },
  //   {
  //     label: "Check Thresholds",
  //     sub: "Alert engine scan",
  //     state: "pending",
  //   },
  // ];

  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [energy, setEnergy] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [donutData, setDonutData] = useState([]);
  const [lData, setLData] = useState([]);
  const [bData, setBData] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [total, setTotal] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [peakHour, setPeakHour] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [buildingId, setBuildingId] = useState("");

  const BUILDING_RULES = {
    1: {
      normal: (hour, day) => {
        if (day === "SATURDAY" || day === "SUNDAY") return { min: 15, max: 20 };

        if ((hour >= 9 && hour < 11) || (hour >= 15 && hour < 17))
          return { min: 60, max: 70 };

        if (hour > 11 && hour < 15)
          return { min: 110, max: 120 };

        return { min: 15, max: 20 };
      }
    },

    2: {
      normal: (hour) => {
        if (hour >= 11 && hour <= 16)
          return { min: 220, max: 230 };

        if ((hour > 16 && hour <= 18) || (hour >= 8 && hour <= 10))
          return { min: 120, max: 130 };

        return { min: 20, max: 30 };
      }
    },

    3: {
      normal: (hour) => {
        if (hour >= 11 && hour <= 16)
          return { min: 170, max: 190 };

        if ((hour > 16 && hour <= 18) || (hour >= 8 && hour <= 10))
          return { min: 90, max: 100 };

        return { min: 20, max: 30 };
      }
    },

    4: {
      normal: (hour) => {
        if (hour >= 11 && hour <= 16)
          return { min: 90, max: 100 };

        if ((hour > 16 && hour <= 18) || (hour >= 8 && hour <= 10))
          return { min: 50, max: 60 };

        return { min: 20, max: 30 };
      }
    },

    5: {
      normal: (hour) => {
        if (hour >= 9 && hour <= 16)
          return { min: 80, max: 90 };

        if ((hour > 16 && hour <= 18) || hour === 8)
          return { min: 120, max: 130 };

        return { min: 10, max: 15 };
      }
    },

    default: {
      normal: (hour, day, month) => {
        let min = 50;
        let max = 60;

        if (month === "APRIL" || month === "MAY") {
          min += 50;
          max += 50;
        }

        if (hour >= 18 && hour <= 24) {
          min += 300;
          max += 310;
        } else if ((hour >= 6 && hour < 9) || (hour >= 13 && hour <= 17)) {
          min += 200;
          max += 210;
        } else {
          min += 50;
          max += 60;
        }

        return { min, max };
      }
    }
  };

  const fetchEnergyData = async () => {
    try {
      let url = "http://localhost:8080/energydata";

      if (startDate && endDate && buildingId) {
        url = `http://localhost:8080/energydata/filter?start=${startDate}:00&end=${endDate}:00&buildingId=${buildingId}`;
      } else if (startDate && endDate) {
        url = `http://localhost:8080/energydata/filter/date?start=${startDate}:00&end=${endDate}:00`;
      } else if (buildingId) {
        url = `http://localhost:8080/energydata/filter/buildingId/${buildingId}`;
      }

      const res = await fetch(url);

      if (!res.ok) {
        const errorMessage = await res.text();

        setError(errorMessage);

        setChartData([]);
        setDonutData([]);
        setSensors([]);
        setAlerts([]);

        return;
      }

      const data = await res.json();

      setEnergy(Array.isArray(data) ? data : []);

      setError("");

      if (data.length === 0) {
        setChartData([]);
        setDonutData([]);
        setSensors([]);
        setAlerts([]);
        setTotal(0);
        setPeakHour("--");
        setEfficiency(100);
        return;
      }

      const buildChartData = (data = []) => {
        const map = new Map();

        data.forEach(item => {
          const date = new Date(item.timeStamp);

          if (isNaN(date.getTime())) return;

          const key =
            Math.floor(date.getTime() / 1000) * 1000;

          const value =
            Number(item.energyUsage) || 0;

          if (!map.has(key)) {
            map.set(key, {
              time: key,
              total: 0
            });
          }

          map.get(key).total += value;
        });

        return Array.from(map.values())
          .sort((a, b) => a.time - b.time);
      };

      setChartData(buildChartData(data));

      const multiLineData = []

      const lineMap = {}

        ; (data || []).forEach(item => {
          const date = new Date(item.timeStamp)
          const timeKey = date.getHours() + " : " + date.getMinutes() + " : " + date.getSeconds()
          if (!lineMap[timeKey]) {
            lineMap[timeKey] = { timeStamp: timeKey }
          }
          lineMap[timeKey][`B${item.buildingId}`] = Number(item.energyUsage)
        })

      for (let key in lineMap) {
        multiLineData.push(lineMap[key])
      }

      // multiLineData.sort((a,b)=>a.timeStamp.localeCompare(b.timeStamp))
      const MAX_POINTS = 20
      const trimmedData = multiLineData.slice(-MAX_POINTS)
      setLData(trimmedData)

      const barDataMap = {};
      ; (data || []).forEach(item => {
        barDataMap[item.buildingId] = item.energyUsage
      });

      const barData = Object.keys(barDataMap).map(id => ({
        building: `B${id}`,
        energy: barDataMap[id]
      }));
      setBData(barData);

      const buildingTotals = {};

      data.forEach((item) => {
        if (!buildingTotals[item.buildingId]) {
          buildingTotals[item.buildingId] = 0;
        }

        buildingTotals[item.buildingId] += item.energyUsage * (5 / 3600);
      });

      const colors = [
        "#00FFB2",
        "#00C8FF",
        "#9B6DFF",
        "#FFB800",
        "#FF4E6A",
        "#a9ff4e",
      ];

      const donut = Object.entries(buildingTotals).map(
        ([id, value], index) => ({
          name: BUILDING_NAMES[id],
          value: Number(value.toFixed(2)),
          display: `${value.toFixed(2)} kWh`,
          color: colors[index % colors.length],
        })
      );

      setDonutData(donut);

      const getExpectedRange = (item) => {
        const date = new Date(item.timeStamp);

        const hour = date.getHours();
        const day = date.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
        const month = date.toLocaleString("en-US", { month: "long" }).toUpperCase();

        const rules = BUILDING_RULES[item.buildingId];

        if (!rules) {
          return { min: 0, max: 999999 };
        }

        return rules.normal(hour, day, month);
      };

      const sensorData = data.map((item, index) => {
        const { min, max } = getExpectedRange(item);

        return {
          id: index,
          name: BUILDING_NAMES[item.buildingId],
          current: item.energyUsage,
          minThreshold: min,
          maxThreshold: max,
          dateTime: new Date(item.timeStamp).toLocaleString("en-IN")
        };
      });

      setSensors(sensorData);

      // const alertsData = data
      //   .filter((item) => item.energyUsage > THRESHOLD)
      //   .map((item, index) => ({
      //     id: index,
      //     type:
      //       item.energyUsage > THRESHOLD * 1.1
      //         ? "critical"
      //         : "warning",

      //     title:
      //       item.energyUsage > THRESHOLD * 1.1
      //         ? "⚡ Critical Overload"
      //         : "⚠ Threshold Exceeded",

      //     msg: `${BUILDING_NAMES[item.buildingId]} → ${item.energyUsage} kW`,

      //     time: new Date(item.timeStamp).toLocaleTimeString(
      //       "en-IN",
      //       {
      //         hour12: false,
      //       }
      //     ),
      //   }));

      // setAlerts(alertsData);

      const getAlertType = (item) => {
        const date = new Date(item.timeStamp);

        const hour = date.getHours();
        const day = date.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
        const month = date.toLocaleString("en-US", { month: "long" }).toUpperCase();

        const buildingRule =
          BUILDING_RULES[item.buildingId] || BUILDING_RULES.default;

        const { min, max } = buildingRule.normal(hour, day, month);

        const value = item.energyUsage;

        if (value > max * 1.2) {
          return {
            type: "anomaly",
            title: "🚨 Anomaly Detected",
            expected: max,
            actual: value
          };
        }

        if (value > max) {
          return {
            type: "surge",
            title: "⚡ Surge Detected",
            expected: max,
            actual: value
          };
        }

        if (value < min * 0.6) {
          return {
            type: "drop",
            title: "📉 Low Usage Detected",
            expected: min,
            actual: value
          };
        }

        return null;
      };
      
      
      const alertsData = data
      .map((item, index) => {
        const alert = getAlertType(item);
        
        if (!alert) return null;
        
          return {
            id: index,
            type: alert.type,
            title: alert.title,
            msg: `${BUILDING_NAMES[item.buildingId]} → ${alert.actual.toFixed(2)} kW (expected ${alert.expected})`,
            time: new Date(item.timeStamp).toLocaleTimeString("en-IN")
          };
        })
        .filter(Boolean);

      setAlerts(alertsData)
      // console.log(BUILDING_RULES)

      const totalConsumption = data.reduce(
        (sum, item) => sum + item.energyUsage * (5 / 3600),
        0
      );

      setTotal(Math.round(totalConsumption));

      const peak = data.reduce(
        (max, item) =>
          item.energyUsage > max.energyUsage
            ? item
            : max,
        data[0]
      );

      setPeakHour(
        new Date(peak.timeStamp).toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      );

      setEfficiency(
        Math.min(
          100,
          Math.round(100 - alertsData.length * 5)
        )
      );
    } catch (err) {
      console.error(err);

      setError("Failed to connect to server");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchEnergyData();

    const interval = setInterval(() => {
      fetchEnergyData();
    }, 5000);

    return () => clearInterval(interval);
  }, [startDate, endDate, buildingId]);

  useEffect(() => {
    const tick = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString("en-IN", {
          hour12: true,
        })
      );

      setDate(
        now.toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    };

    tick();

    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, []);

  const alertCount = alerts.filter((a) => a.type !== "info").length;

  const applyFilters = () => { fetchEnergyData(); };

  return (
    <>
      {
        initialLoading ? (
          <Loader />
        ) : (
          <div className="app">
            <aside className="sidebar">
              <div className="sidebar-logo">
                <div className="logo-wrap">
                  <span className="logo-icon">⚡</span>

                  <span className="logo-text">
                    CampusGrid
                  </span>
                </div>
              </div>

              <nav className="sidebar-nav">
                {navItems.map((n) => (
                  <div
                    key={n}
                    className={`nav-item ${activeNav === n ? "active" : ""}`}
                    onClick={() => {
                      if (n === "Dashboard") {
                        scrollToSection(dashboardRef, n);
                      }

                      else if (n === "Analytics") {
                        scrollToSection(analyticsRef, n);
                      }

                      else if (n === "Sensors") {
                        scrollToSection(sensorsRef, n);
                      }

                      else if (n === "Alerts") {
                        scrollToSection(alertsRef, n);
                      }
                    }}
                  >
                    {n}
                  </div>
                ))}
              </nav>

              <div className="sidebar-footer">
                <div className="status-pill">
                  <span className="pulse-dot"></span>
                  System Online
                </div>

                <p className="sidebar-time">
                  {time}
                </p>
              </div>
            </aside>

            <main className="main">
              <div ref={dashboardRef} className="dashboard-section">
                <header className="topbar">
                  <div className="page-title">
                    {/* <span className="breadcrumb">
                    Overview
                  </span> */}

                    <h1>Energy Dashboard</h1>
                  </div>

                  <div className="topbar-right">
                    <span className="date-badge">
                      {date}
                    </span>

                    {/* <div className="avatar">
                    AD
                  </div> */}
                  </div>
                </header>

                <div className="kpi-grid">
                  {[
                    {
                      label: "Total Consumption",
                      val: total,
                      unit: "kWh Today",
                      icon: "⚡",
                      trend: "+4.2%",
                    },
                    {
                      label: "Peak Hour",
                      val: peakHour,
                      unit: "Highest Load",
                      icon: "🕐",
                    },
                    {
                      label: "Active Alerts",
                      val: alertCount,
                      unit: "Needs Attention",
                      icon: "⚠",
                      danger: true,
                    },
                    {
                      label: "Efficiency Score",
                      val: efficiency,
                      unit: "/ 100",
                      icon: "🛡",
                      trend: "+1.8%",
                    },
                  ].map((k, i) => (
                    <div
                      key={i}
                      className="kpi-card"
                    >
                      <div className="kpi-icon">
                        {k.icon}
                      </div>

                      <span className="kpi-label">
                        {k.label}
                      </span>

                      <span
                        className="kpi-value"
                        style={{
                          color:
                            k.danger && k.val > 0
                              ? "#FF4E6A"
                              : "#E8F4F0",
                        }}
                      >
                        {k.val}
                      </span>

                      <span className="kpi-unit">
                        {k.unit}
                      </span>

                      {k.trend && (
                        <span className="kpi-trend">
                          {k.trend}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div ref={analyticsRef} className="chart-row">
                  <div className="chart-card">
                    <div className="chart-header">
                      <div>
                        <p className="chart-title">
                          Energy Consumption
                        </p>

                        <p className="chart-subtitle">
                          24-hour real-time view
                        </p>
                      </div>
                    </div>

                    <div>
                      <LineChart width={900} height={300} data={chartData}>

                        {/* <CartesianGrid strokeDasharray="3 3" /> */}

                        <XAxis
                          dataKey="time"
                          type="number"
                          domain={["dataMin", "dataMax"]}
                          tickFormatter={(t) =>
                            new Date(t).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })
                          }
                          tick={{ fill: "#3D5566", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <YAxis
                          tick={{ fill: "#3D5566", fontSize: 10 }}
                          tickFormatter={(v) =>
                            `${Number(v).toFixed(2)} kW`
                          }
                          axisLine={false}
                          tickLine={false}
                        />

                        <Tooltip
                          labelFormatter={(t) =>
                            new Date(t).toLocaleTimeString("en-IN")
                          }
                          formatter={(v) => [
                            `${Number(v).toFixed(2)} kW`,
                            "Cumulative Consumption"
                          ]}
                        />

                        <Line
                          type="linear"
                          dataKey="total"
                          stroke="#00FFB2"
                          strokeWidth={2}
                          dot={false}
                          isAnimationActive={false}
                        />

                      </LineChart>
                    </div>

                    <div className="chart-legend">
                      <span className="legend-dot legend-dot--green"></span>
                      Consumption

                      <span
                        className="legend-dot legend-dot--amber"
                        style={{ marginLeft: 14 }}
                      ></span>
                      Threshold
                    </div>
                  </div>

                  <div className="chart-card">
                    <p className="chart-title">
                      By Building
                    </p>

                    <p className="chart-subtitle">
                      Distribution today
                    </p>

                    <div className="donut-wrap">
                      <PieChart width={200} height={180}>
                        <Pie
                          data={donutData}
                          cx={95}
                          cy={85}
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {donutData.map((entry, i) => (
                            <Cell
                              key={i}
                              fill={entry.color + "CC"}
                              stroke={entry.color}
                              strokeWidth={1.5}
                            />
                          ))}
                        </Pie>

                        <Tooltip
                          formatter={(v, n) => [
                            `${v.toFixed(2)} kWh`,
                            n,
                          ]}
                        />
                      </PieChart>

                      <div className="donut-center">
                        <span className="donut-total">
                          Total:{total.toFixed(2)}
                        </span>

                        <span className="donut-label">
                          kWh
                        </span>
                      </div>
                    </div>

                    <div className="donut-legend">
                      {donutData.map((b, i) => (
                        <div
                          key={i}
                          className="donut-legend-item"
                        >
                          <span
                            className="donut-legend-dot"
                            style={{
                              background: b.color,
                            }}
                          ></span>

                          <span className="donut-legend-label">
                            {b.name}:
                          </span>

                          <span className="donut-legend-val">
                            {b.display}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="middle-row">
                  <div className="middle-row1">
                    <div className="linchart-buildingwise">
                      <h2>Energy Usage Over Time</h2>
                      <LineChart width={700} height={300} data={lData}>
                        <XAxis dataKey="timeStamp" />
                        <YAxis />
                        <Tooltip formatter={(value) => Number(value).toFixed(2)} />
                        <Legend />
                        <Line type="monotone" dataKey="B1" name="Admin Block" stroke='#8884d8' strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="B2" name="CSE Block" stroke='#82ca9d' strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="B3" name="ECE Block" stroke='#ff7300' strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="B4" name="Mechanical Block" stroke='#5eff00' strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="B5" name="Library" stroke='#00ff80' strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="B6" name="Hostel" stroke='#aa00ff' strokeWidth={2} dot={false} />
                      </LineChart>
                    </div>
                  </div>
                  <div className="middle-row2">
                    <div>
                      <h2>Building Comparision</h2>
                      <BarChart width={500} height={300} data={bData}>
                        <XAxis dataKey="building" />
                        <YAxis />
                        <Tooltip formatter={(value) => Number(value).toFixed(2)} />
                        <Legend />
                        <Bar dataKey="energy" fill='#852867' />
                      </BarChart>
                    </div>
                  </div>
                </div>

                <div className="bottom-row">
                  <div className="filter-row">
                    <div className='filter'>
                      <div className='filter-container'>
                        <h2>Filters</h2>
                        <div className='input-container'>
                          <label htmlFor="start">Start Time:</label>
                          <input name='start' type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                          {startDate && (
                            <button onClick={() => setStartDate('')} id='clearButton'>Clear</button>
                          )}
                        </div>
                        <div className='input-container'>
                          <label htmlFor="end">End Time:</label>
                          <input name='end' type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                          {endDate && (
                            <button onClick={() => setEndDate('')} id='clearButton'>Clear</button>
                          )}
                        </div>
                        <div className='input-container'>
                          <label htmlFor="building id">Building Id:</label>
                          <select value={buildingId} onChange={(e) => setBuildingId(e.target.value)}>
                            <option value="">All Buildings</option>
                            <option value="1">Admin Block</option>
                            <option value="2">CSE Block</option>
                            <option value="3">ECE Block</option>
                            <option value="4">Mechanical Block</option>
                            <option value="5">Library</option>
                            <option value="6">Hostel</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div ref={sensorsRef} className="card">
                    <div className="chart-header">
                      <div>
                        <p className="chart-title">
                          Sensors Data
                        </p>

                        <p className="chart-subtitle">
                          Simulated readings
                        </p>
                      </div>

                      <div className="live-tag">
                        <span className="pulse-dot"></span>
                        LIVE
                      </div>
                    </div>

                    <div className="sensor-table-wrapper">
                      <table className="sensor-table">
                        <thead>
                          <tr>
                            {[
                              "Location",
                              "Reading",
                              "Status",
                              "TimeStamp"
                            ].map((h) => (
                              <th key={h}>{h}</th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {sensors.map((s, i) => {
                            const over = s.current > s.maxThreshold;
                            const near = s.current > s.maxThreshold * 0.9;
                            const under = s.current < s.minThreshold;

                            let type = "ok";
                            let label = "OK";

                            if (s.current > s.maxThreshold * 1.2) {
                              type = "alert";
                              label = "Anomaly";
                            }
                            else if (s.current > s.maxThreshold) {
                              type = "warn";
                              label = "Surge";
                            }
                            else if (s.current < s.minThreshold) {
                              type = "warn";
                              label = "Low";
                            }

                            return (
                              <tr key={i}>
                                <td className="sensor-name">
                                  {s.name}
                                </td>

                                <td className="sensor-reading">
                                  {s.current.toFixed(2)} kW
                                </td>

                                <td>
                                  <span
                                    className={`badge ${type}`}
                                  >
                                    {label}
                                  </span>
                                </td>
                                <td className="sensor-datetime">
                                  {s.dateTime}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div ref={alertsRef} className="card">
                    <div className="chart-header">
                      <div>
                        <p className="chart-title">
                          Alerts
                        </p>

                        <p className="chart-subtitle">
                          Threshold violations
                        </p>
                      </div>

                      <button className="clear-btn" onClick={() => setAlerts([])}>
                        Clear All
                      </button>
                    </div>

                    <div className="alert-list">
                      {alerts.length === 0 ? (
                        <p
                          style={{
                            color: "#3D5566",
                            fontSize: "0.78rem",
                            textAlign: "center",
                            padding: 24,
                            fontFamily:
                              "'DM Mono', monospace",
                          }}
                        >
                          No active alerts
                        </p>
                      ) : (
                        alerts.map((a) => (
                          <div
                            key={a.id}
                            className={`alert-item ${a.type}`}
                          >
                            <p className="alert-title">
                              {a.title}
                            </p>

                            <p className="alert-msg">
                              {a.msg}
                            </p>

                            <p className="alert-time">
                              {a.time}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* <div className="card">
            <p className="chart-title">
              Data Pipeline
            </p>

            <p
              className="chart-subtitle"
              style={{ marginBottom: 16 }}
            >
              System flow status
            </p>

            {PIPELINE.map((step, i) => (
              <div
                key={i}
                className="flow-step"
              >
                {i < PIPELINE.length - 1 && (
                  <div className="flow-line"></div>
                )}

                <div
                  className={`flow-dot ${step.state}`}
                >
                  {step.state === "done"
                    ? "✓"
                    : step.state === "active"
                      ? "●"
                      : i + 1}
                </div>

                <div>
                  <p className="flow-label">
                    {step.label}
                  </p>

                  <p className="flow-sublabel">
                    {step.sub}
                  </p>
                </div>
              </div>
            ))}
          </div> */}
                </div>

                {error && (
                  <div
                    style={{
                      margin: "20px 28px",
                      background:
                        "rgba(255,78,106,0.1)",
                      border:
                        "1px solid rgba(255,78,106,0.3)",
                      color: "#FF4E6A",
                      padding: "14px 18px",
                      borderRadius: 10,
                      fontSize: "0.85rem",
                    }}
                  >
                    {error}
                  </div>
                )}

                {initialLoading && (
                  <div
                    style={{
                      margin: "20px 28px",
                      color: "#7A9AAE",
                      fontFamily:
                        "'DM Mono', monospace",
                    }}
                  >
                    Loading dashboard...
                  </div>
                )}
              </div>
            </main>
          </div>
        )
      }
    </>
  );
}