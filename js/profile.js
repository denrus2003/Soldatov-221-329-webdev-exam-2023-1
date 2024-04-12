'use strict';
/// <reference path="library.js" />

let orderPage = 1, perOrderPage = 5, totalOrders = 0;
let selectedOrderData, selectedOrderGuide, selectedOrderRoute;

async function addOrdersRow(num, orderData) {
    let rows = document.getElementById("orders-rows");
    let template = document.getElementById("template-orders-row");
    let newRow = template.content.firstElementChild.cloneNode(true);
    let route = await getRoute(orderData.route_id);
    newRow.children[1].textContent = num;
    newRow.children[3].textContent = route.name;
    newRow.children[5].textContent = orderData.date;
    newRow.children[7].textContent = orderData.price + "₽";
    newRow.dataset.id = orderData.id;
    rows.append(newRow);
}

function setupOrderButtons() {
    let buttons = document.getElementById("orders-page-buttons");
    let buttonTemplate = document.getElementById("orders-btn-template");
    buttons.innerHTML = "";
    let toFirstPage = buttonTemplate.content.firstElementChild.cloneNode(true);
    toFirstPage.textContent = "<<"; toFirstPage.disabled = orderPage == 1;
    let toPreviousPage = buttonTemplate.content
        .firstElementChild.cloneNode(true);
    toPreviousPage.textContent = "<"; toPreviousPage.disabled = orderPage == 1;

    let toLastPage = buttonTemplate.content.firstElementChild.cloneNode(true);
    toLastPage.textContent = ">>"; 
    toLastPage.disabled = orderPage == Math.ceil(totalOrders / perOrderPage);

    let toNextPage = buttonTemplate.content.firstElementChild.cloneNode(true);
    toNextPage.textContent = ">"; 
    toNextPage.disabled = orderPage == Math.ceil(totalOrders / perOrderPage);
    buttons.append(toFirstPage); buttons.append(toPreviousPage);
    for (let i = 1; i <= Math.ceil(totalOrders / perOrderPage); i++) {
        if (i > 2 && i < Math.ceil(totalOrders / perOrderPage) - 1 && 
            Math.abs(orderPage - i) > 1) {
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
            if (orderPage == i) {
                btn.disabled = true;
                btn.classList.toggle("btn-secondary");
                btn.classList.toggle("btn-primary");
            }
            buttons.append(btn);
        }
    }
    buttons.append(toNextPage); buttons.append(toLastPage);
}

async function drawOrders() {
    let orders = await getOrders();
    if (orders.error)
        return;
    totalOrders = orders.length;
    setupOrderButtons();
    let ordersRows = document.getElementById("orders-rows");
    ordersRows.innerHTML = "";
    for (let i = 0; i < orders.length; i++) {
        if (i >= (orderPage - 1) * perOrderPage &&
            i < orderPage * perOrderPage) {
            await addOrdersRow(i + 1, orders[i]);
        }
    }
}

function ordersPageButtonClickHandler(event) {
    let target = event.target;
    if (target.tagName != "BUTTON" || target.disabled)
        return;
    if (target.innerHTML == "&lt;&lt;")
        orderPage = 1;
    else if (target.innerHTML == "&lt;")
        orderPage--;
    else if (target.innerHTML == "&gt;&gt;")
        orderPage = Math.ceil(totalOrders / perOrderPage);
    else if (target.innerHTML == "&gt;")
        orderPage++;
    else
        orderPage = Number(target.innerHTML);
    drawOrders();
}

async function orderButtonClickHandler(event) {
    let target = event.target.closest(".btn");
    if (!target)
        return;
    let orderId = target.closest(".mb-lg-0").dataset.id;
    let order = await getOrder(orderId);
    let route = await getRoute(order.route_id);
    let guide = await getGuide(order.guide_id);
    selectedOrderData = order;
    selectedOrderGuide = guide;
    selectedOrderRoute = route;
    if (target.classList.contains("btn-view")) {
        document.getElementById("order-view-modal-name")
            .textContent = guide.name;
        document.getElementById("order-view-modal-route")
            .textContent = route.name;
        document.getElementById("order-view-modal-date")
            .textContent = order.date;
        document.getElementById("order-view-modal-time")
            .textContent = order.time;
        document.getElementById("order-view-modal-duration")
            .textContent = order.duration;
        document.getElementById("order-view-modal-people")
            .textContent = order.persons;
        document.getElementById("order-view-modal-option1")
            .hidden = !order.optionFirst;
        document.getElementById("order-view-modal-option2")
            .hidden = !order.optionSecond;
        document.getElementById("order-view-modal-price")
            .textContent = order.price;
    } else if (target.classList.contains("btn-edit")) {
        document.getElementById("order-edit-modal-name")
            .textContent = guide.name;
        document.getElementById("order-edit-modal-route")
            .textContent = route.name;
        document.getElementById("order-edit-modal-price")
            .textContent = order.price;
        document.forms[0][0].value = order.date;
        document.forms[0][1].value = order.time;
        document.forms[0][2].selectedIndex = order.duration - 1;
        document.forms[0][3].value = order.persons;
        document.forms[0][4].checked = order.optionFirst;
        document.forms[0][5].checked = order.optionSecond;
        document.forms[0][6].value = orderId;
        recalculatePrice(document.forms[0], guide.pricePerHour,
            document.getElementById("order-edit-modal-price"));
    } else if (target.classList.contains("btn-delete")) {
        document.getElementById("order-delete-modal")
            .dataset.id = orderId;
    }
    event.stopPropagation();
}

function assembleAndEditOrder() {
    let orderData = new FormData(document.forms[0]);
    let price = Number(document.getElementById("order-edit-modal-price")
        .textContent);
    orderData.append("price", price);
    orderData.set("optionFirst", Number(document.forms[0][4].checked));
    orderData.set("optionSecond", Number(document.forms[0][5].checked));
    updateOrder(document.forms[0][6].value, orderData);
}

function addEventListeners() {
    document.getElementById("orders-rows")
        .addEventListener("click", orderButtonClickHandler);
    document.getElementById("order-edit-modal-submit")
        .addEventListener("click", assembleAndEditOrder);
    document.getElementById("order-delete-modal-submit")
        .addEventListener("click", () => {
            let id = document.getElementById("order-delete-modal")
                .dataset.id;
            removeOrder(id);
        });
    document.getElementById("orders-page-buttons")
        .addEventListener("click", ordersPageButtonClickHandler);
    document.forms[0].addEventListener("change", () => recalculatePrice(
        document.forms[0], selectedOrderGuide.pricePerHour,
        document.getElementById("order-edit-modal-price")));
}

drawOrders();
addEventListeners();