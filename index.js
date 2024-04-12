'use strict';
/// <reference path="library.js" />

let routePage = 1, perRoutePage = 5, totalRoutes = 0;
let routeSearchParams = {name: "", mainObject: ""};
let guideSearchParams = {lang: "", from: "", to: ""};
let selectedRouteID = undefined, selectedGuideID = undefined;
let clickedRouteRow = undefined, clickedGuideRow = undefined;


function setupRouteButtons() {
    let buttons = document.getElementById("routes-page-buttons");
    let buttonTemplate = document.getElementById("routes-btn-template");
    buttons.innerHTML = "";
    let toFirstPage = buttonTemplate.content.firstElementChild.cloneNode(true);
    toFirstPage.textContent = "<<"; toFirstPage.disabled = routePage == 1;
    let toPreviousPage = buttonTemplate.content
        .firstElementChild.cloneNode(true);
    toPreviousPage.textContent = "<"; toPreviousPage.disabled = routePage == 1;

    let toLastPage = buttonTemplate.content.firstElementChild.cloneNode(true);
    toLastPage.textContent = ">>"; 
    toLastPage.disabled = routePage == Math.ceil(totalRoutes / perRoutePage);

    let toNextPage = buttonTemplate.content.firstElementChild.cloneNode(true);
    toNextPage.textContent = ">"; 
    toNextPage.disabled = routePage == Math.ceil(totalRoutes / perRoutePage);
    buttons.append(toFirstPage); buttons.append(toPreviousPage);
    for (let i = 1; i <= Math.ceil(totalRoutes / perRoutePage); i++) {
        if (i > 2 && i < Math.ceil(totalRoutes / perRoutePage) - 1 && 
            Math.abs(routePage - i) > 1) {
            if (!buttons.lastElementChild.classList.contains("btn-dots")) {
                let btn = buttonTemplate.content.
                    firstElementChild.cloneNode(true);
                btn.textContent = "...";
                btn.disabled = true;
                btn.classList.toggle("btn-dots");
                buttons.append(btn);
            }
        } else {
            let btn = buttonTemplate.content.firstElementChild.cloneNode(true);
            btn.textContent = String(i);
            if (routePage == i) {
                btn.disabled = true;
                btn.classList.toggle("btn-secondary");
                btn.classList.toggle("btn-primary");
            }
            buttons.append(btn);
        }
    }
    buttons.append(toNextPage); buttons.append(toLastPage);
}

function addRouteRow(routeData) {
    let routesRows = document.getElementById("routes-rows");
    let routeRowTemplate = document.getElementById("routes-row-template");
    let newRow = routeRowTemplate.content.firstElementChild.cloneNode(true);
    newRow.dataset.id = routeData.id;
    newRow.children[1].textContent = routeData.name;
    newRow.children[3].textContent = routeData.description;
    newRow.children[5].textContent = routeData.mainObject;
    routesRows.append(newRow);
}

function addGuideRow(guideData) {
    let guidesRows = document.getElementById("guides-rows");
    let guideRowTemplate = document.getElementById("guides-row-template");
    let newRow = guideRowTemplate.content.firstElementChild.cloneNode(true);
    newRow.dataset.id = guideData.id;
    newRow.children[1].textContent = guideData.name;
    newRow.children[2].textContent = guideData.language;
    newRow.children[3].textContent = guideData.workExperience;
    newRow.children[4].textContent = guideData.pricePerHour + "₽";
    guidesRows.append(newRow);

}

function setGuideLanguages(languages) {
    let languagesSelect = document.forms[1][0];
    if (languagesSelect.innerHTML != "")
        return;
    let defaultOption = document.createElement("option");
    defaultOption.text = "Выберите язык";
    defaultOption.value = "";
    defaultOption.selected = true;
    languagesSelect.options.add(defaultOption);
    for (let i of languages) {
        let newOption = document.createElement("option");
        newOption.text = i;
        newOption.value = i;
        languagesSelect.options.add(newOption);
    }
}

function addMainObjects(mainObjects, mainObjectString) {
    let substrings = [], prev = 0;
    if (mainObjectString.includes("1.")) {
        let n = 1;
        for (let i = 1; i < mainObjectString.length; i++) {
            if (mainObjectString[i] == "." && 
            mainObjectString[i - 1] == String(n % 10)) {
                n++;
                substrings.push(mainObjectString.substr(prev, i - prev));
                prev = i + 1;
                i++;
            }
        }
    } else for (let i = 0; i < mainObjectString.length; i++) {
        if (mainObjectString[i] == "–" || mainObjectString[i] == "-" && 
            (i > 0 && mainObjectString[i - 1] == " " ||
            i < mainObjectString.length - 1 && 
            mainObjectString[i + 1] == " ")) {
            substrings.push(mainObjectString.substr(prev, i - prev));
            prev = i + 1; i++;
        } else if (mainObjectString[i] == ":")
            prev = i + 1; i++;
    }
    substrings = substrings.map(x => x.trim());
    mainObjects = new Set([...mainObjects, ...substrings]);
    return mainObjects;
}

function setMainObjects(mainObjects) {
    let mainObjectSelect = document.forms[0][1];
    if (mainObjectSelect.innerHTML != "")
        return;
    let defaultOption = document.createElement("option");
    defaultOption.text = "Выберите основной объект";
    defaultOption.value = "";
    mainObjectSelect.options.add(defaultOption);
    for (let i of mainObjects) {
        let newOption = document.createElement("option");
        newOption.text = i.substr(0, 25) + (i.length > 25 ? "..." : "");
        newOption.value = i;
        mainObjectSelect.options.add(newOption);
    }
}

function filterGuide(guide) {
    if (guideSearchParams.lang &&
        guide.language != guideSearchParams.lang)
        return false;
    if (guideSearchParams.from &&
        guide.workExperience < guideSearchParams.from)
        return false;
    if (guideSearchParams.to &&
        guide.workExperience > guideSearchParams.to)
        return false;
    return true;
}

function filterRoute(route) {
    if (routeSearchParams.name &&
        !(route.name.includes(routeSearchParams.name) || 
        route.description.includes(routeSearchParams.name) ||
        route.mainObject.includes(routeSearchParams.name)))
        return false;
    if (routeSearchParams.mainObject &&
        !route.mainObject.includes(routeSearchParams.mainObject))
        return false;
    return true;
}

async function drawRoutes() {
    let routes = await getRoutes();
    if (routes == {})
        return;
    let routesRows = document.getElementById("routes-rows");
    let mainObjects = new Set();
    let count = 0;
    routesRows.innerHTML = "";
    for (let i = 0; i < routes.length; i++) {
        mainObjects = addMainObjects(mainObjects, 
            routes[i].mainObject);
        if (filterRoute(routes[i])) {
            if (count >= (routePage - 1) * perRoutePage &&
                count < routePage * perRoutePage)
                addRouteRow(routes[i]);
            count++;
        }
    }
    totalRoutes = count;
    setMainObjects(mainObjects);
    setupRouteButtons();
}

async function drawGuides() {
    let guides = await getGuides(selectedRouteID);
    if (guides == {})
        return;
    let guidesRows = document.getElementById("guides-rows");
    let languages = new Set();
    guidesRows.innerHTML = "";
    for (let i = 0; i < guides.length; i++) {
        if (filterGuide(guides[i])) {
            addGuideRow(guides[i]);
        }
        languages.add(guides[i].language);
    }
    setGuideLanguages(languages);
}

function showGuidesTable(route) {
    let id = route.dataset.id;
    let name = route.children[1].textContent;
    let guides = document.getElementById("guides");
    guides.hidden = false;
    window.scrollTo(0, findPosition(guides));
    document.getElementById("route-name").textContent = name;
    selectedRouteID = id;
    document.forms[1][0].innerHTML = "";
    drawGuides();
}

function routesTableClickHandler(event) {
    let target = event.target;
    if (target.tagName != "BUTTON" || !target.classList.contains("route-btn"))
        return;
    let route = target.parentElement.parentElement;
    clickedGuideRow = undefined;
    if (clickedRouteRow) {
        clickedRouteRow.classList.remove('selected-row');
    }
    route.classList.add('selected-row');
    clickedRouteRow = route;
    clickedRouteRow.classList.remove('selected-row');
    route.classList.add('selected-row');
    clickedRouteRow = route;
    showGuidesTable(route);
    event.stopPropagation();
}

function routesPageButtonClickHandler(event) {
    clickedRouteRow = undefined;
    clickedGuideRow = undefined;
    let target = event.target;
    if (target.tagName != "BUTTON" || target.disabled)
        return;
    if (target.innerHTML == "&lt;&lt;")
        routePage = 1;
    else if (target.innerHTML == "&lt;")
        routePage--;
    else if (target.innerHTML == "&gt;&gt;")
        routePage = Math.ceil(totalRoutes / perRoutePage);
    else if (target.innerHTML == "&gt;")
        routePage++;
    else
        routePage = Number(target.innerHTML);
    drawRoutes();
}

async function guideSelectClickHandler(event) {
    let target = event.target;
    if (target.tagName != "BUTTON" || !target.classList.contains("guide-btn"))
        return;
    let row = target.parentElement.parentElement;
    let route = await getRoute(selectedRouteID);
    let guide = await getGuide(Number(row.dataset.id));

    if (clickedGuideRow) {
        clickedGuideRow.classList.remove('selected-row');
    }

    let closestRow = target.closest('.row');
    if (closestRow) {
        closestRow.classList.add('selected-row');
        clickedGuideRow = closestRow;
    }

    document.getElementById("guide-modal-name").textContent = 
        row.children[1].textContent;
    document.getElementById("guide-modal-route").textContent = 
        route.name;
    document.forms[2][0].value = "2024-01-01";
    document.forms[2][1].value = "12:00";
    document.forms[2][2].selectedIndex = 0;
    document.forms[2][3].value = 1;
    document.forms[2][4].checked = false;
    document.forms[2][5].checked = false;
    document.forms[2][6].value = row.dataset.id;
    selectedGuideID = guide;
    recalculatePrice(document.forms[2], guide.pricePerHour, 
        document.getElementById("guide-modal-price"));
    event.stopPropagation();
}

async function assembleAndSendOrder() {
    let guide = await getGuide(Number(document.forms[2][6].value));
    let orderData = new FormData();
    orderData.append("route_id", selectedRouteID);
    orderData.append("guide_id", Number(guide.id));
    orderData.append("date", document.forms[2][0].value);
    orderData.append("time", document.forms[2][1].value);
    orderData.append("duration", Number(document.forms[2][2].value));
    orderData.append("persons", Number(document.forms[2][3].value));
    orderData.append("price", 
        Number(document.getElementById("guide-modal-price").textContent));
    orderData.append("optionFirst", Number(document.forms[2][4].checked));
    orderData.append("optionSecond", Number(document.forms[2][5].checked));
    makeOrder(orderData);
}

function addEventListeners() {
    document.getElementById("routes-rows")
        .addEventListener("click", routesTableClickHandler);
    document.getElementById("routes-page-buttons")
        .addEventListener("click", routesPageButtonClickHandler);
    document.getElementById("guides-rows")
        .addEventListener("click", guideSelectClickHandler);
    document.getElementById("guide-modal-submit")
        .addEventListener("click", assembleAndSendOrder);
    document.forms[0].onsubmit = () => {
        routeSearchParams.name = document.forms[0][0].value;
        routeSearchParams.mainObject = document.forms[0][1].value;
        drawRoutes();
        return false;
    };
    document.forms[1].onsubmit = () => {
        guideSearchParams.lang = document.forms[1][0].value;
        guideSearchParams.from = document.forms[1][1].value;
        guideSearchParams.to = document.forms[1][2].value;
        drawGuides();
        return false;
    };
    document.forms[2].addEventListener("change", () => recalculatePrice(
        document.forms[2], selectedGuideID.pricePerHour, 
        document.getElementById("guide-modal-price")
    ));
}
window.onload = drawRoutes;
drawRoutes();
addEventListeners();