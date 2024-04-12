'use strict';

let baseURL = new URL("http://exam-2023-1-api.std-900.ist.mospolytech.ru/");
let apiKey = "d71c466e-977a-4208-8a10-75063f17000f";

function findPosition(obj) {
    var currenttop = 0;
    if (obj.offsetParent) {
        do {
            currenttop += obj.offsetTop;
        } while ((obj = obj.offsetParent));
        return currenttop;
    }
}

function makeAlert(type, message) {
    if (!["success", "danger", "info"].includes(type))
        return;
    let alerts = document.getElementById("alerts");
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" ',
        'data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');
    setTimeout(() => window.scrollTo(0, findPosition(alerts)), 500);
    alerts.append(wrapper);
}

async function getRoute(id) {
    let url = new URL(baseURL);
    url.pathname = `/api/routes/${id}`;
    url.searchParams.append("api_key", apiKey);
    let response = await fetch(url);
    let json = await response.json();
    if (json.error) {
        makeAlert("danger", json.error);
        return {};
    }
    return json;
}

async function getGuide(id) {
    let url = new URL(baseURL);
    url.pathname = `/api/guides/${id}`;
    url.searchParams.append("api_key", apiKey);
    let response = await fetch(url);
    let json = await response.json();
    if (json.error) {
        makeAlert("danger", json.error);
        return {};
    }
    return json;
}

async function getOrder(id) {
    let url = new URL(baseURL);
    url.pathname = `/api/orders/${id}`;
    url.searchParams.append("api_key", apiKey);
    let response = await fetch(url);
    let json = await response.json();
    if (json.error) {
        makeAlert("danger", json.error);
        return {};
    }
    return json;
}

async function updateOrder(id, orderData) {
    let url = new URL(baseURL);
    url.pathname = `/api/orders/${id}`;
    url.searchParams.append("api_key", apiKey);
    fetch(url, {method: "PUT", body: orderData})
        .then(response => response.json())
        .then(response => {
            if (response.error) {
                makeAlert("danger", response.error);
                return;
            }
            makeAlert("success", "Запрос успешно изменен");
            drawOrders();
        });
}

async function removeOrder(id) {
    let url = new URL(baseURL);
    url.pathname = `/api/orders/${id}`;
    url.searchParams.append("api_key", apiKey);
    fetch(url, {method: "DELETE"})
        .then(response => response.json())
        .then(response => {
            if (response.error) {
                makeAlert("danger", response.error);
                return;
            }
            makeAlert("success", "Запрос успешно удален");
            drawOrders();
        });
}

async function makeOrder(orderData) {
    let url = new URL(baseURL);
    url.pathname = '/api/orders';
    url.searchParams.append("api_key", apiKey);
    fetch(url, {method: "POST", body: orderData})
        .then(response => response.json())
        .then(response => {
            if (response.error) {
                makeAlert("danger", response.error);
                return;
            }
            makeAlert("success", "Запрос успешно добавлен");
        });
}

async function getRoutes() {
    let url = new URL(baseURL);
    url.pathname = "/api/routes";
    url.searchParams.append("api_key", apiKey);
    let response = await fetch(url);
    let json = await response.json();
    if (json.error) {
        makeAlert("danger", json.error);
        return {error: json.error};
    }
    return json;
}

async function getGuides(selectedRoute) {
    if (!selectedRoute)
        return {error: "selectedRoute is undefined"};
    let url = new URL(baseURL);
    url.pathname = `/api/routes/${selectedRoute}/guides`;
    url.searchParams.append("api_key", apiKey);
    let response = await fetch(url);
    let json = await response.json();
    if (json.error) {
        makeAlert("danger", json.error);
        return {error: json.error};
    }
    return json;
}

async function getOrders() {
    let url = new URL(baseURL);
    url.pathname = "/api/orders";
    url.searchParams.append("api_key", apiKey);
    let response = await fetch(url);
    let json = await response.json();
    if (json.error) {
        makeAlert("danger", json.error);
        return {error: json.error};
    }
    return json;
}

async function recalculatePrice(form, guidePrice, priceElement) {
    let price = priceElement;
    if (form[1].value == "")
        form[1].value = "09:00";
    let date = form[0].valueAsDate;
    let time = form[1].valueAsDate;
    if (time.getMinutes() > 0 && time.getMinutes() < 30)
        form[1].value = `${String(time.getUTCHours()).padStart(2, "0")}:30`;
    else if (time.getMinutes() > 30) 
        form[1].value = `${String(time.getUTCHours() + 1).padStart(2, "0")}:00`;
    if (form[1].value == "")
        form[1].value = "09:00";
    if (form[1].value == "" || time.getUTCHours() < 9)
        form[1].value = "09:00";
    if (form[1].value == "23:30")
        form[1].value = "23:00";
    let priceNum = Number(guidePrice) 
        * Number(form[2].value);
    let holidays = ["2-23", "3-8", "5-1", "5-9", "6-12", "11-4"];
    if (form[4].checked) {
        if ((date.getDay() + 6) % 7 >= 5) {
            priceNum *= 1.25; // Увеличение на 25% в выходные дни
        } else {
            priceNum *= 1.3; // Увеличение на 30% в будние дни
        }
    }
    if (form[5].checked) {
        priceNum -= priceNum * 0.25; // Уменьшение на 25% при выборе опции
    }
    if (form[3].value >= 10)
        priceNum += 1500;
    else if (form[3].value >= 5)
        priceNum += 1000;
    price.textContent = String(Math.round(priceNum));
}
window.onload = getRoutes;
window.onload = getGuides;