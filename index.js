const userTab= document.querySelector("[data-userWeather]");
const searchTab= document.querySelector("[data-searchWeather]");

const userContainer= document.querySelector(".weather-container");
const grantAccessContainer= document.querySelector(".grant-location-container");
const searchForm= document.querySelector("[data-searchForm]");
const loadingScreen= document.querySelector(".loading-container");

const userInfoContainer= document.querySelector(".user-info-container");


let currentTab=userTab;
const API_KEY="f2e809e91974a00db12802a543ade5cf";

currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
  if(clickedTab!=currentTab){
    currentTab.classList.remove("current-tab");
    currentTab=clickedTab;
    currentTab.classList.add("current-tab")

    if(!searchForm.classList.contains("active")){
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active"); 
    }
    else{
      //means we were on the search tab and we want to visibl weather tab
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      //now we at your weather , now we have to display wether also
      //so we have to check local storage first 
      //for cordinates, if we have saved them there
      getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click",()=>{
  //pass clicked tab as input patrameter
  switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
  //pass clicked tab as input patrameter
  switchTab(searchTab);
});

//check if cordinates are already present in session storage
function getfromSessionStorage(){
  const localCoordinates= sessionStorage.getItem("user-coordinates");
  if(!localCoordinates){
    grantAccessContainer.classList.add("active");
  }
  else{
    const coordinates= JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates){
  const{lat,lon}= coordinates;

  //pehle grant access htaao kyuki loader dikhana hai
  grantAccessContainer.classList.remove("active");

  loadingScreen.classList.add("active");

  //now call api here
  try{
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data=await  response.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  }
  catch(err){
    loadingScreen.classList.remove("active");
  }
}

function renderWeatherInfo(weatherInfo){
  //fetch elements first
  const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weatherInfo object and put in Ui
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = weatherInfo?.main?.temp;
    windspeed.innertext = weatherInfo?.wind?.speed;
    humidity.innertext = weatherInfo?.main?.humidity;
    cloudiness.innerText = weatherInfo?.clouds?.all;

}
function getLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else{
    alert("geo location is not accessible");
  }
}
function showPosition(position){
  const userCoordinates={
    lat:position.coords.latitude,
    lon:position.coords.longitude,
  }
  sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton= document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);


let searchInput= document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
  e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
});
async function fetchSearchWeatherInfo(city){
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");
  try{
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data=await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  }
  catch(err){

  }
}