'use strict';
// URL API
var url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders';

// Опции запроса
var options = {
    method: 'GET',
    headers: {
        'API-Key': 'd71c466e-977a-4208-8a10-75063f17000f'
    }
};

// Отправка запроса
fetch(url, options)
    .then(response => response.json())
    .then(data => {
        // Обработка полученных данных
        console.log(data);
    })
    .catch(error => {
        // Обработка ошибок
        console.error('Ошибка:', error);
    });

// Функция для отображения данных заявок
function displayRequests() {
    var tbody = document.getElementById('requests');
    tbody.innerHTML = '';
    for (var i = 0; i < requests.length; i++) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + (i + 1) + '</td>'
            + '<td>' + requests[i].route + '</td>'
            + '<td>' + requests[i].date + '</td>'
            + '<td>' + requests[i].cost + '</td>'
            + '<td>'
            + '<button onclick="showDetails(' + i + ')">Подробнее</button>'
            + '<button onclick="showEditForm(' + i + ')">Редактировать</button>'
            // eslint-disable-next-line max-len
            + '<button onclick="showDeleteConfirmation(' + i + ')">Удалить</button>'
            + '</td>';
        tbody.appendChild(tr);
    }
}

// Функция для отображения подробной информации о заявке
function showDetails(index) {
    var detailsModal = document.getElementById('detailsModal');
    detailsModal.innerHTML = 'Маршрут: ' + requests[index].route
        + '<br>Дата: ' + requests[index].date
        + '<br>Стоимость: ' + requests[index].cost;
    detailsModal.style.display = 'block';
}

// Функция для отображения формы редактирования заявки
function showEditForm(index) {
    var editModal = document.getElementById('editModal');
    // eslint-disable-next-line max-len
    editModal.innerHTML = '<form onsubmit="editRequest(' + index + '); return false;">'
        + 'Маршрут: <input value="' + requests[index].route + '"><br>'
        + 'Дата: <input type="date" value="' + requests[index].date + '"><br>'
        // eslint-disable-next-line max-len
        + 'Стоимость: <input type="number" value="' + requests[index].cost + '"><br>'
        + '<input type="submit" value="Сохранить">'
        + '</form>';
    editModal.style.display = 'block';
}

// Функция для редактирования заявки
function editRequest(index) {
    // Здесь должен быть код для сохранения изменений в заявке
    // eslint-disable-next-line max-len
    // После сохранения изменений, скройте форму редактирования и обновите отображение заявок
    displayRequests();
    document.getElementById('editModal').style.display = 'none';
}

// Функция для отображения подтверждения удаления заявки
function showDeleteConfirmation(index) {
    var deleteModal = document.getElementById('deleteModal');
    deleteModal.innerHTML = 'Вы действительно хотите удалить эту заявку?'
        + '<button onclick="deleteRequest(' + index + ')">Да</button>'
        // eslint-disable-next-line max-len
        + '<button onclick="this.parentElement.style.display=\'none\'">Нет</button>';
    deleteModal.style.display = 'block';
}

// Функция для удаления заявки
function deleteRequest(index) {
    // Здесь должен быть код для удаления заявки
    // eslint-disable-next-line max-len
    // После удаления заявки, скройте подтверждение удаления и обновите отображение заявок
    displayRequests();
    document.getElementById('deleteModal').style.display = 'none';
}

//API Добпавить заявку
// URL API
var url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders';

// Данные заявки
var orderData = {
    // Заполните здесь данные заявки
};

// Опции запроса
var options = {
    method: 'POST',
    headers: {
        'API-Key': 'd71c466e-977a-4208-8a10-75063f17000f',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
};

// Отправка запроса
fetch(url, options)
    .then(response => response.json())
    .then(data => {
        // Обработка полученных данных
        console.log(data);
    })
    .catch(error => {
        // Обработка ошибок
        console.error('Ошибка:', error);
    });


// Отображение заявок при загрузке страницы
window.onload = displayRequests;