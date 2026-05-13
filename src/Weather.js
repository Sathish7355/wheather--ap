import React, {useState} from 'react'
import propTypes from "prop-types"

import searchIcon from "./assets/search.png";
import clearIcon from "./assets/clear.png"
import humidity1Icon from "./assets/humidity1.png"
import windIcon from "./assets/wind.png"
import snowIcon from "./assets/snow.png"
import rainIcon from "./assets/rain.png"
import drizzleIcon from "./assets/drizzle.png"
import cloudsIcon from "./assets/clouds.png"

 const WeatherDetails =({icon,temp,city,country,lat,lon,humidity,wind})=>{
  return(
    <>
    <div className='image'>
      <img src={icon} alt="img" height={160} width={160}/>
    </div>
    <div className='temp'>{temp !== null ? `${temp}°C` : "--"}°C</div>
    <div className='location'>{city}</div>
    <div className='country'>{country}</div>
    <div className='coord'>
      <div>
        <span className='lat'>latitude</span>
        <span>{lat}</span>
        </div>
       <div>
        <span className='log'>longitude</span>
        <span>{lon}</span>
        </div>
      </div>
      <div className='data-container'>
        <div className='element'>
        <img src={humidity1Icon} alt="humidity" height={35} width={35}/>
          <div className='data'>
            <div className='humidity-precent'>{humidity}%</div>
            <div className='text'>humidity</div>
          </div>
        </div>
        <div className='element'>
        <img src={windIcon} alt="wind" height={35} width={35}/>
          <div className='data'>
            <div className='wind-precent'>{wind} km/h</div>
            <div className='text'>Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  )
}
WeatherDetails.propTypes={
  icon:propTypes.string.isRequired,
  temp:propTypes.number.isRequired,
  city:propTypes.string.isRequired,
  country:propTypes.string.isRequired,
  humidity:propTypes.number.isRequired,
   wind :propTypes.number.isRequired,
  lat:propTypes.number.isRequired,
   lon:propTypes.number.isRequired
}

function Weather() {
  let api_key="b211c2b21f761722c3fa3d0941acde2e"
  const [text,setText]=useState("")
  const [icon,setIcon]= useState(snowIcon);
 
  const[city,setCity] =useState("chicago"); 
  const [country, setCountry] = useState("US");
  const [lat,setLat] = useState(0)
  const [lon ,setLon]=useState(0)
   const [temp ,setTemp]= useState(null);
 const [humidity,setHumidity] = useState(null)
const [wind,setWind] = useState(null)
  const [citynotfound ,setCitynotFound]=useState(false)
  const [loading ,setLoading]=useState(false)
   const [error, setError] =useState(null)

  const weatherIconMap ={
    "01d":clearIcon,
    "01n":clearIcon,
    "02d":cloudsIcon,
    "02n":cloudsIcon,
    "03d":drizzleIcon,
    "03n":drizzleIcon,
    "04d":drizzleIcon,
    "04n":drizzleIcon,
    "09d":rainIcon,
    "09n":rainIcon,
    "10d":rainIcon,
    "10n":rainIcon,
    "13d":snowIcon,
    "13n":snowIcon,
  };

  const search = async ()=>{
    setLoading(true)
    let url =`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;
    try {
    let res= await fetch(url);
    let data= await res.json()
     console.log (data)
     if (data.cod ==="404"){
     console.error ("City not Found")
     setCitynotFound (true)
     setLoading(false)
     return;
     }
     setHumidity (data.main.humidity);
     setWind (data.wind.speed);
     setTemp (Math.floor(data.main.temp));
     setCity (data.name);
     setCountry (data.sys.country);
     setLat (data.coord.lat);
     setLon (data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
       setIcon(weatherIconMap[weatherIconCode] || clearIcon)
       setCitynotFound(false)

    }catch (error){
      console.error("an error occurred:",error.message)
      setError ("an error was while fetching weather data.")
    }finally {
      setLoading(false)
    }
  }
  const handelCity =(e)=>{
  setText(e.target.value)
  }
  const handelKey =(e)=>{
     if(e.key === "Enter")
      search()
  }


  return (
    <>
    <div className='container'>
        <div className='input-container'>
            <input type= "text" className='cityInput' placeholder='search city' onChange={handelCity} value={text} onKeyDown={handelKey}/>
            <div className="searchIcon">
                <img src={searchIcon} alt="search" onClick={()=> search ()} width={20} height={20}/>
            </div>
        </div>
       

          {loading &&<div className='loading-message'>loading...</div>}
          {error &&<div className='error-message'>{error}</div>}
          {citynotfound &&<div className='city-notfound'>City Not Found</div>}

          {!loading && !citynotfound && temp !== null && (
  <WeatherDetails
    icon={icon}
    temp={temp}
    city={city}
    country={country}
    lat={lat}
    lon={lon}
    humidity={humidity}
    wind={wind}
  />
)}
    </div>
     </>
  )
}
export default Weather;