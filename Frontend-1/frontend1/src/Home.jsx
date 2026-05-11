import './App.css'
import { useEffect, useState } from 'react'
import {Routes,Route,Link} from 'react-router-dom'
import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,Legend,BarChart,Bar, AreaChart, Area,PieChart,Pie,Cell, ReferenceLine} from 'recharts'

export default function Home(){
    const[energy,setEnergy]=useState([]);
    const[lastUpdated,setLastUpdated]=useState(null)

  useEffect(()=>{
    const fetchEnergyData=async()=>{
      try{
        const res=await fetch(`http://localhost:8080/energydata`);
        const data=await res.json();
        setEnergy(Array.isArray(data)?data:[]);
        setLastUpdated(new Date().toLocaleTimeString())
        console.log(data);
      }
      catch(err){
        console.error(err);
      }
    };
    fetchEnergyData()
    const interval=setInterval(()=>{
      fetchEnergyData()
    },5000)
    return ()=>clearInterval(interval)
  },[]);

  const barDataMap={};
  ;(energy || []).forEach(item=>{
    barDataMap[item.buildingId]=item.energyUsage
  });

  const barData=Object.keys(barDataMap).map(id=>({
    building:`B${id}`,
    energy:barDataMap[id]
  }));

  const multiLineData=[]

  const map={}

  ;(energy || []).forEach(item=>{
    const date=new Date(item.timeStamp)
    const timeKey=date.getHours()+" : "+date.getMinutes()+" : "+date.getSeconds() 
    if(!map[timeKey]){
      map[timeKey]={timeStamp:timeKey }
    }
    map[timeKey][`B${item.buildingId}`]=Number(item.energyUsage)
  })

  for(let key in map){
    multiLineData.push(map[key])
  }
  
  // multiLineData.sort((a,b)=>a.timeStamp.localeCompare(b.timeStamp))
  const MAX_POINTS=20
  const trimmedData=multiLineData.slice(-MAX_POINTS)

  const getTimeKey=(t)=>new Date(t).toISOString().slice(11,19)

  const latestTime=energy.length?getTimeKey(energy[energy.length-1].timeStamp):null
  const pieData=(energy || [])
  .filter(item=>getTimeKey(item.timeStamp)===latestTime)
  .map(item=>({
    name:`B${item.buildingId}`,
    value:Number(item.energyUsage)
  }))
  const COLORS=["#8884d8","#82ca9d","#ff7300"]

  const highBuildings=(energy || []).filter(
    item=>getTimeKey(item.timeStamp) === latestTime && item.energyUsage>80
  )

  return(
    <>
      <div className='home'>
        <div className='graphs'>
          <Link to={"/filter"}><button>Filter Page</button></Link>
          <p>Auto-refreshing every 5 seconds...</p>
          <p>Last Updated:{lastUpdated}</p>
          <div>
            <h1>Campus Energy Data(Simulated)</h1>
            <div>
              <h2>Energy Usage Over Time</h2>
              <LineChart width={700} height={300} data={trimmedData}>
                <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="timeStamp"/>
                  <YAxis />
                  <Tooltip formatter={(value)=>Number(value).toFixed(2)}/>
                  <Legend />
                  <ReferenceLine y={80} stroke="red" strokeDasharray="3 3"/>
                  <Line type="monotone" dataKey="B1" name="Building 1" stroke='#8884d8' strokeWidth={2} dot={false}/>
                  <Line type="monotone" dataKey="B2" name="Building 2" stroke='#82ca9d' strokeWidth={2} dot={false}/>
                  <Line type="monotone" dataKey="B3" name="Building 3" stroke='#ff7300' strokeWidth={2} dot={false}/>
              </LineChart>
            </div>
            <div>
              <h2>Energy Usage Over Time</h2>
              <AreaChart width={700} height={300} data={trimmedData}>
                <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="timeStamp"/>
                  <YAxis />
                  <Tooltip formatter={(value)=>Number(value).toFixed(2)} labelFormatter={(label)=>label}/>
                  <Legend />
                  <ReferenceLine y={80} stroke="red" strokeDasharray="3 3"/>
                  <defs>
                    <linearGradient id='colorB1' x1={"0"} y1={"0"} x2={"0"} y2={"1"}>
                      <stop offset={"5%"} stopColor='#8884d8' stopOpacity={0.8}/>
                      <stop offset={"95%"} stopColor='#8884d8' stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id='colorB2' x1={"0"} y1={"0"} x2={"0"} y2={"1"}>
                      <stop offset={"5%"} stopColor='#82ca9d' stopOpacity={0.8}/>
                      <stop offset={"95%"} stopColor='#82ca9d' stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id='colorB3' x1={"0"} y1={"0"} x2={"0"} y2={"1"}>
                      <stop offset={"5%"} stopColor='#ff7300' stopOpacity={0.8}/>
                      <stop offset={"95%"} stopColor='#ff7300' stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area dataKey="B1" name="Building 1" stroke='#8884d8' fill='url(#colorB1)'/>
                  <Area dataKey="B2" name="Building 2" stroke='#82ca9d' fill='url(#colorB2)'/>
                  <Area dataKey="B3" name="Building 3" stroke='#ff7300' fill='url(#colorB3)'/>
              </AreaChart>
            </div>
            <div>
              <h2>Building Comparision</h2>
              <BarChart width={500} height={300} data={barData}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="building"/>
                <YAxis />
                <Tooltip formatter={(value)=>Number(value).toFixed(2)}/>
                <Legend />
                <Bar dataKey="energy" fill='#852867'/>
              </BarChart>
            </div>
          </div>
        </div>
        <div className='statsCard'>
          <h2>Real Time Stats</h2>
          <PieChart width={450} height={300}>
            <Pie data={pieData} dataKey={"value"} nameKey={"name"} cx={"50%"} cy={"50%"} outerRadius={100} label={({name,value,percent})=>`${name}:${value.toFixed(2)}(${(percent*100).toFixed(0)}%)`}>
              {pieData.map((entry,index)=>(
                <Cell key={index} fill={COLORS[index%COLORS.length]}/>
              ))}
            </Pie>
            <Tooltip formatter={(value)=>Number(value).toFixed(2)}/>
            <Legend/>
          </PieChart>
        </div>
        <div className='table'>
          {highBuildings.length>0 && (
            <p style={{color:"red", fontWeight:'bold'}}>
              High Energy:
              {highBuildings.map(b=>`B${b.buildingId} (${b.energyUsage.toFixed(2)})`).join(',')}
            </p>
          )}
          <table border='1'>
            <thead>
              <tr>
                <th>Building Number</th>
                <th>Energy Usage</th>
                <th>Time Stamp</th>
              </tr>
            </thead>
            <tbody>
              {energy && energy.map((item,index)=>(
              <tr key={index} style={{backgroundColor:item.energyUsage>80 ? "#ff0000": "transparent"}}>
                <td>{item.buildingId}</td>
                <td>{item.energyUsage}</td>
                <td>{new Date(item.timeStamp).toLocaleTimeString()}</td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}