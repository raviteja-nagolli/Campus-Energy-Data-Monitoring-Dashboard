import './App.css'
import { useEffect, useState } from 'react'
import {Routes,Route,Link} from 'react-router-dom'
import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,Legend,BarChart,Bar} from 'recharts'

export default function Filter(){
    const[energy,setEnergy]=useState([]);
    const[startDate,setStartDate]=useState('');
    const[endDate,setEndDate]=useState('');
    const[buildingId, setBuildingId]=useState('');

    const formatDate=(date)=>date?date+":00":''

    const fetchEnergyData=async()=>{
        try{
            let url=`http://localhost:8080/energydata`
            if(startDate && endDate && buildingId){
                url=`http://localhost:8080/energydata/filter?start=${formatDate(startDate)}&end=${formatDate(endDate)}&buildingId=${buildingId}`
            }
            else if(startDate && endDate){
                url=`http://localhost:8080/energydata/filter/date?start=${formatDate(startDate)}&end=${formatDate(endDate)}`
            }else if(buildingId){
                url=`http://localhost:8080/energydata/filter/buildingId/${buildingId}`
            }
            console.log("Fetching:", url)
            const res=await fetch(url);
            const data=await res.json();
            setEnergy(Array.isArray(data)?data:[]);
        }
        catch(err){
            console.error(err);
        }
    };
    useEffect(()=>{
        fetchEnergyData();
    },[]);

    return(
        <>
            <Link to={"/"}><button>Home</button></Link>
            <div className='filter'>
                <div className='filter-container'>
                    <h2>Filters</h2>
                    <div className='input-container'>
                        <label htmlFor="start">Start Time:</label>
                        <input name='start' type="datetime-local" value={startDate} onChange={(e)=>setStartDate(e.target.value)}/>
                        {startDate &&(
                            <button onClick={()=>setStartDate('')} id='clearButton'>Clear</button>
                        )}
                    </div>
                    <div className='input-container'>
                        <label htmlFor="end">End Time:</label>
                        <input name='end' type="datetime-local" value={endDate} onChange={(e)=>setEndDate(e.target.value)}/>
                        {endDate &&(
                            <button onClick={()=>setEndDate('')} id='clearButton'>Clear</button>
                        )}
                    </div>
                    <div className='input-container'>
                        <label htmlFor="building id">Building Id:</label>
                        <select value={buildingId} onChange={(e)=>setBuildingId(e.target.value)}>
                            <option value="">All Buildings</option>
                            <option value="1">Building 1</option>
                            <option value="2">Building 2</option>
                            <option value="3">Building 3</option>
                        </select>
                    </div>
                    <button onClick={fetchEnergyData}>Apply Filters</button>
                </div>
                <div className='filter-display'>
                    <div>
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
                            <tr key={index}>
                                <td>{item.buildingId}</td>
                                <td>{item.energyUsage}</td>
                                <td>{new Date(item.timeStamp).toLocaleTimeString()}</td>
                            </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>    
        </>
    )
}