const indexCards = document.getElementById("cards")
const upcominCards = document.getElementById("upcominCards")
const pastCards = document.getElementById("pastCards")
const checkBox = document.getElementById("form")
const details = document.getElementById("details")
const searchInput = document.getElementById("buscador")
const highest = document.getElementById("EventHighestStats")
const lowest = document.getElementById("EventLowestStats")
const largerCapacity = document.getElementById("largerCapacity")
const upcomingStats = document.getElementById("upcomingStats")
const pastStats = document.getElementById("pastStats")


apiData()
// FUNCIONES DE JS
function apiData (){
    fetch("http://amazing-events.herokuapp.com/api/events").then(api => api.json()).then(data => {
        let events = data.events
        let date = data.currentDate
        
        if(indexCards){
            mainCards(events)
            printCategorys(events)

            searchInput.addEventListener("keyup", () =>{
                let arrayFilter1 = search(events, searchInput.value)
                let arrayFilter2 = filterCards(arrayFilter1)
                mainCards(arrayFilter2)
            })
        
            checkBox.addEventListener("change" ,()=>{
                let arrayFilter1 = filterCards(events)
                let arrayFilter2 = search(arrayFilter1, searchInput.value)
                mainCards(arrayFilter2)
            })
        }

        if(upcominCards){
            upcomingCardsFilter(events,date)
            printCategorys(events);

            searchInput.addEventListener("keyup", () =>{
                let arrayFilter1 = search(events, searchInput.value)
                let arrayFilter2 = filterCards(arrayFilter1)
                upcomingCardsFilter(arrayFilter2, date)
            })

            checkBox.addEventListener("change" ,()=>{
                let arrayFilter1 = filterCards(events)
                let arrayFilter2 = search(arrayFilter1, searchInput.value)
                upcomingCardsFilter(arrayFilter2, date)
            })
        }

        if(pastCards){
            pastCardsFilter(events, date)
            printCategorys(events)

            searchInput.addEventListener("keyup", () =>{
                let arrayFilter1 = search(events, searchInput.value)
                let arrayFilter2 = filterCards(arrayFilter1)
                pastCardsFilter(arrayFilter2, date)
            })

            checkBox.addEventListener("change" ,()=>{
                let arrayFilter1 = filterCards(events)
                let arrayFilter2 = search(arrayFilter1, searchInput.value)
                pastCardsFilter(arrayFilter2, date)
            })
        }

        if(details){
            const urlParams = new URLSearchParams(location.search);
            const urlName = urlParams.get("name")
            let evento = events.filter ( events => events.name == urlName)[0]
            cardsDetails(evento)
        }

        if(highest && lowest && largerCapacity){
            ordenarPorPorcentaje(events)
            pintarRow(events)
        }
        
        if(upcomingStats){
            let arrayUpcomingStats = events.filter(event => event.date >= date)
            ingresosYAsistencias(events)
            StatsTable(arrayUpcomingStats, upcomingStats)
        }
        
        if(pastStats){
            let arrayPastStats = events.filter(event => event.date < date)
            ingresosYAsistencias(events)
            StatsTable(arrayPastStats, pastStats)
        }
    })
}

function printCategorys(array){
    let categoryChecks = [];
    array.forEach(even =>{
        if(!categoryChecks.includes(even.category)){
            categoryChecks.push(even.category)
        }
    })
    categoryChecks.forEach(cate =>{
            let checkBoxes = document.createElement("div")
            checkBoxes.className="checkbox"
            checkBoxes.innerHTML=`
                                <input type="checkbox" value="${cate}" id="${cate}">
                                <label for="${cate}">${cate}</label>
            `
            checkBox.appendChild(checkBoxes);
    })
}

function search (array, key){
    let arrayFilter = array.filter(e => e.name.toLowerCase().includes(key.toLowerCase()))
    return arrayFilter
}

function mainCards (array){
    indexCards.innerHTML=""
    if(array.length == 0){
        let searchNotFound = document.createElement('div')
        searchNotFound.className="notFound"
        searchNotFound.innerHTML = `<h2 class="text-center m-5">your search was not found</h2>`
        indexCards.appendChild(searchNotFound)
    }
    else{
        array.sort((eventos1,eventos2) => {
            if(eventos1.name<eventos2.name){return-1}
            if(eventos1.name>eventos2.name){return 1}
        }).forEach(eventos => {
            let divCard = document.createElement("div");
            divCard.className = "carta card"
            divCard.innerHTML = `
            <img src="${eventos.image}" class="card-img-top" alt="events">
            <div class="row card-body text-center">
            <h5 class="card-title">${eventos.name}</h5>
            <p class="card-text">${eventos.description}</p>
            <div class="row d-flex align-items-end">
            <p class="col price">$ ${eventos.price}</p>
            <a href="./details.html?name=${eventos.name}"  class="col btn boton more">More</a>
            </div>
            </div>`
            indexCards.appendChild(divCard);
        })
    }
}

function filterCards(array){
    let checkboxes = document.querySelectorAll("input[type='checkbox']")
    let arrayCheckboxes = Array.from(checkboxes)
    let checkBoxCheckeds = arrayCheckboxes.filter(check => check.checked).map(check => check.value)
    let cardsF = array.filter(eventos => checkBoxCheckeds.includes(eventos.category))
    if(cardsF.length == 0){
        return array
    }
    else{
        return cardsF
    }
}

function cardsDetails (evento){
    let divDetail = document.createElement("div")
    divDetail.className = "row g-0"
    divDetail.innerHTML=`
                        <div class="col-md-8">
                            <img class="img-details" src="${evento.image}" alt="${evento.name}">
                        </div>
                        <div class="col-md-4 d-flex align-items-center">
                            <div class="card-body text-center">
                                <h2 class="card-title">${evento.name}</h2>
                                <p class="card-text"><span class="card-span">Date:</span> ${evento.date}</p>
                                <p class="card-text"><span class="card-span">Description:</span> ${evento.description}</p>
                                <p class="card-text"><span class="card-span">Category:</span> ${evento.category}</p>
                                <p class="card-text"><span class="card-span">Place:</span> ${evento.place}</p>
                                <p class="card-text"><span class="card-span">Capacity:</span> ${evento.capacity}</p>
                                <p class="card-text"><span class="card-span">Assistance:</span> ${evento.assistance}</p>
                                <p class="card-text"><span class="card-span">Price:</span> ${evento.price}</p>
                            </div>
                        </div>
                        `
    details.appendChild(divDetail)
}

function upcomingCardsFilter(array, date){
    upcominCards.innerHTML=""
    if(array.length == 0){
        let searchNotFound = document.createElement('div')
        searchNotFound.className="notFound"
        searchNotFound.innerHTML = `<h2 class="text-center m-5">There is no results for your search :(</h2>`
        upcominCards.appendChild(searchNotFound)
    }
    else{
        array.sort((eventos1,eventos2) => {
            if(eventos1.name<eventos2.name){return-1}
            if(eventos1.name>eventos2.name){return 1}
        }).filter(eventos => eventos.date >= date)
        .forEach(eventos => {
            let divCard = document.createElement("div");
            divCard.className = "carta card filter"
            divCard.innerHTML = `
            <img src="${eventos.image}" class="card-img-top" alt="events">
            <div class="row card-body text-center">
                <h5 class="card-title">${eventos.name}</h5>
                <p class="card-text">${eventos.description}</p>
                <div class="row d-flex align-items-end">
                <p class="col price">$ ${eventos.price}</p>
                <a href="./details.html?name=${eventos.name}" class="col btn boton">More</a>
                </div>
            </div>`
            upcominCards.appendChild(divCard)
        })
    }
}

function pastCardsFilter(array, date){
    pastCards.innerHTML=""
    if(array.length == 0){
        let searchNotFound = document.createElement('div')
        searchNotFound.className="notFound"
        searchNotFound.innerHTML = `<h2 class="text-center m-5">your search was not found</h2>`
        pastCards.appendChild(searchNotFound)
    }
    else{
        array.sort((eventos1,eventos2) => {
            if(eventos1.name<eventos2.name){return-1}
            if(eventos1.name>eventos2.name){return 1}
        }).filter(eventos => eventos.date < date)
        .forEach(eventos => {
            let divCard = document.createElement("div");
            divCard.className = "carta card filter"
            divCard.innerHTML = `
            <img src="${eventos.image}" class="card-img-top" alt="events">
            <div class="row card-body text-center">
                <h5 class="card-title">${eventos.name}</h5>
                <p class="card-text">${eventos.description}</p>
                <div class="row d-flex align-items-end">
                <p class="col price">$ ${eventos.price}</p>
                <a href="./details.html?name=${eventos.name}" class="col btn boton">More</a>
                </div>
            </div>`
            pastCards.appendChild(divCard)
        })
    }
}

function ordenarPorPorcentaje(array){
    let attendance = []
    let attendanceCalc = 0
    array.forEach(elemento => {
        if(elemento.assistance != undefined){
            attendanceCalc =  Math.round(((elemento.assistance) * 100) / elemento.capacity)
            attendance.push([elemento.name, attendanceCalc])
        }else {
            attendanceCalc =  Math.round(((elemento.estimate) * 100) / elemento.capacity)
            attendance.push([elemento.name, attendanceCalc])
        }
    })
    attendance.sort(function(a, b){
        return b[1] - a[1]
    })
    lowest.innerText = (attendance[attendance.length-1]) + ' %'
    highest.innerText = (attendance[0]) + ' %'
}

function pintarRow(array){
    array.sort(function (a, b){
        return b.capacity - a.capacity
    })

    largerCapacity.innerText = (array[0].name)
}

function ingresosYAsistencias(array){
    let categorias = []
    let arrayStats= []
    array.forEach(evento => {
        if(!categorias.includes(evento.category)){
            categorias.push(evento.category)
        }
    })
    
    categorias.forEach(categoria => {
        let eventosFilteredTable = array.filter(evento => evento.category == categoria)
        let ingresos = eventosFilteredTable.map(evento => ((evento.assistance ?evento.assistance :evento.estimate) * evento.price))
        let totalIngresos = ingresos.reduce((actual, siguiente) => actual = actual + siguiente, 0)
        
        let porcentajeAsistencia = eventosFilteredTable.map(evento => (evento.assistance ?evento.assistance :evento.estimate) / evento.capacity)
        let promedioAsistencias = Math.round((porcentajeAsistencia.reduce((actual , siguiente)=> actual = actual + siguiente, 0) / porcentajeAsistencia.length)*100)
        arrayStats.push([categoria,totalIngresos,promedioAsistencias])
    })
    return arrayStats
}

function StatsTable(array, contenedor){
    let eventStats = ingresosYAsistencias(array)
    eventStats.forEach(eventStats =>{
        let fila = document.createElement('tr')
        fila.innerHTML =   
        `               <td>${eventStats[0]}</td>
                        <td>$ ${eventStats[1]}</td>
                        <td>${eventStats[2]}%</td>
        `
        contenedor.appendChild(fila)
    })
}