const searchButton=document.getElementById("searchButton");
const searchInput=document.getElementById("searchInput");

searchInput.addEventListener('input', ()=>{
    searchInput.classList.remove('test');
})

searchButton.addEventListener('click', ()=>{
    axios.get("http://api.openweathermap.org/data/2.5/forecast?q="+searchInput.value+"&units=metric&id=524901&appid=628b5c85ea46cec10e48734330847466")
        .then(res=>displayData(res))
        .catch(err=>{
            searchInput.classList.add("test");
            console.clear();
        });
});

function displayData(res){
    let date=res.data.list[0].dt_txt;   
    let data={
        cityName: res.data.city.name,
        temp: Math.round(res.data.list[0].main.temp)+"&#176;C",
        desc: res.data.list[0].weather[0].main,
        hour: "Last updated at "+date.split(" ")[1],
        img: "<img src='http://openweathermap.org/img/wn/"+res.data.list[0].weather[0].icon+".png' width/>",
        additionalInfo: 'Pressure: '+res.data.list[0].main.pressure+" Wind: "+res.data.list[0].wind.speed+"km/h",
    }
    Object.keys(data).forEach(key => {
        document.getElementById(key).innerHTML=data[key];
    });


    for(let i=1;i<=5;i++){
        let listIndex = newDayIndex(date,i);
        displaySecondCards(res, listIndex, i)
        
    }
}   

function displaySecondCards(res, listIndex, cardNum){

    const list=res.data.list;
    let nextDay=list[listIndex];
    let indexAt12 = Math.min(listIndex+4, 39);

    let minMaxTemp = getMinMaxTemp(list, listIndex, Math.min(listIndex+7,39));
    
    let data={
        desc: list[indexAt12].weather[0].main,
        temp: Math.round(minMaxTemp.min)+"&#176;C / "+Math.round(minMaxTemp.max)+"&#176;C",
        date: nextDay.dt_txt.split(" ")[0],
        additionalInfo: 'Pressure: '+list[indexAt12].main.pressure+" Wind: "+list[indexAt12].wind.speed+"km/h",
        img: "<img src='http://openweathermap.org/img/wn/"+list[indexAt12].weather[0].icon+".png' width/>"
    }
    Object.keys(data).forEach(key => {
        document.querySelectorAll(".second-card #"+key)[cardNum-1].innerHTML=data[key];
    });

}


function newDayIndex(currentDate,forwardBy){
    // Get hour
    let hour=currentDate.split(" ")[1].split(":")[0];   
    
    // Math
    // Per 24 hours are 8 elements
    // If the time is 21:00:00, you need to jump 1 element(s)
    // 1 is 8-7  <=> 8-(21/3)

    // Forward - 1 because we had already jumped a day in the future
    let newIndex = 8-(hour/3)+8*(forwardBy-1);
    return newIndex;
}


function getMinMaxTemp(list, start, end){
    let temp={
        max: -100,
        min: 100,
    }
    for(let i=start; i<=end; i++){
        if(temp.max<list[i].main.temp) temp.max=list[i].main.temp;
        if(temp.min>list[i].main.temp) temp.min=list[i].main.temp;
    }
    return temp;
}


// newDay("2021-03-25 21:00:00",2);


navigator.geolocation.getCurrentPosition(position=>{
    axios.get("http://api.openweathermap.org/data/2.5/forecast?lat="+position.coords.latitude+"&lon="+position.coords.longitude+"&units=metric&id=524901&appid=628b5c85ea46cec10e48734330847466")
    .then(res=>displayData(res))
    .catch(err=>{
        searchInput.classList.add("test");
        console.clear();
    });
});



// console.log(navigator.geolocation.getCurrentPosition((position)=>{
//     console.log(position.coords.latitude)
//     // axios.get("http://api.openweathermap.org/data/2.5/forecast?lat="+position.coords.latitude+"&lon="+position.coords.longitude+"&units=metric&id=524901&appid=628b5c85ea46cec10e48734330847466").then(res=>{
//     //     console.log(res);
//     // });
// }));
