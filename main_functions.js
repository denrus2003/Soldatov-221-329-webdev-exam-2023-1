'use strict';
// Функция для отображения гидов при выборе маршрута
function showGuides(routeId) {
    // URL API для получения гидов по маршруту
    // eslint-disable-next-line max-len
    var apiUrl = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes" +
                 "/guides?api_key=d71c466e-977a-4208-8a10-75063f17000f";

    // Создание нового объекта запроса
    var request = new XMLHttpRequest();

    // Инициализация нового запроса
    request.open('GET', apiUrl, true);

    // Обработка ответа
    request.onload = function () {
        alert('req');
        if (request.status >= 200 && request.status < 400) {
            // Успешный ответ
            var guides = JSON.parse(request.responseText);
            alert('guides');

            // Заполнение списка гидов
            var select = document.getElementById('guideSelect');
            select.innerHTML = '<option value="">Выберите гида</option>';
            for (var i = 0; i < guides.length; i++) {
                var option = document.createElement('option');
                option.value = guides[i]['id'];
                option.text = guides[i]['name'];
                select.appendChild(option);
                alert(select.innerHTML);
            }

            // Отображение блока с гидами
            document.getElementById('guides').style.display = 'block';
        } else {
            // Обработка ошибок
            console.error('Ошибка при получении гидов: ' + request.status);
        }
    };

    // Отправка запроса
    request.send();
}

// Получение элемента select с маршрутами
var routeSelect = document.getElementById('routes');

// eslint-disable-next-line max-len
// Добавление обработчика событий для вызова функции showGuides при выборе маршрута
routeSelect.addEventListener('change', function() {
    showGuides(this.value);
});

document.addEventListener('DOMContentLoaded', function() {
    // eslint-disable-next-line max-len
// Добавление обработчика событий для вызова функции showGuides при выборе маршрута
    // Получение элемента select с маршрутами
    var routeSelect = document.getElementById('routes');

    // eslint-disable-next-line max-len
    // Добавление обработчика событий для вызова функции showGuides при выборе маршрута
    if (routeSelect) {
        routeSelect.addEventListener('change', function() {
            showGuides(this.value);
        });
    } else {
        console.error('Элемент с идентификатором "routes" не найден');
    }
});

// Функция для отправки заказа
function submitOrder() {
    // URL API для отправки заказа
    // eslint-disable-next-line max-len
    var apiUrl = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=d71c466e-977a-4208-8a10-75063f17000f";

    // Создание нового объекта запроса
    var request = new XMLHttpRequest();

    // Инициализация нового запроса
    request.open('POST', apiUrl, true);
    request.setRequestHeader('Content-Type', 
        'application/x-www-form-urlencoded');

    // Подготовка данных для отправки
    var data = {
        routeId: document.getElementById('routes').value,
        guideId: document.getElementById('guideSelect').value,
        // Добавьте здесь другие данные формы
    };

    // Преобразование данных в формат x-www-form-urlencoded
    var formData = new FormData();

    // Установка заголовка Content-Type
    var contentTypeHeader = 'application/x-www-form-urlencoded';
    request.setRequestHeader('Content-Type', contentTypeHeader);
    for (var key in data) {
        formData.append(key, data[key]);
    }

    // Обработка ответа
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Успешный ответ
            alert('Заказ успешно отправлен!');
        } else {
            // Обработка ошибок
            console.error('Ошибка при отправке заказа: ' + request.status);
        }
    };

    // Отправка запроса
    request.send(formData);
}
//Функция для получения данных о пешеходных маршрутах
function fetchRoutes() {
    // URL API для получения данных о маршрутах
//eslint-disable-next-line max-len
    var apiUrl = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=d71c466e-977a-4208-8a10-75063f17000f";

    // Создание нового объекта запроса
    var request = new XMLHttpRequest();

    // Инициализация нового запроса
    request.open('GET', apiUrl, true);

    // Обработка ответа
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Успешный ответ
            var routes = JSON.parse(request.responseText);

            // Обновление блока с данными о маршрутах
            var container = document.getElementById('routes');
            container.innerHTML = '<option value="">Выберите маршрут</option>';
            for (var i = 0; i < routes.length; i++) {
                var route = document.createElement('option');
                route.textContent = routes[i].name;
                container.appendChild(route);
            }
        } else {
            // Обработка ошибок
            // eslint-disable-next-line max-len, max-len, max-len
            console.error('Ошибка при получении данных о маршрутах: ' + request.status);
        }
    };

    // Отправка запроса
    request.send();
}

// Вызов функций при загрузке страницы
window.onload = showGuides;
window.onload = fetchRoutes;