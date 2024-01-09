/* eslint-disable max-len */
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
function fetchRoutes() {
    var selectedRouteId = document.getElementById('routes').value;
    // eslint-disable-next-line max-len
    var apiUrl = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=d71c466e-977a-4208-8a10-75063f17000f";
    var request = new XMLHttpRequest();
    request.open('GET', apiUrl, true);
    request.onload = function () {
        function displayRouteDetails() {
            var select = document.getElementById('routes');
            var selectedRouteId = select.value;
            var selectedRoute = select.options[select.selectedIndex].text;

            var apiUrl = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/" + selectedRouteId + "?api_key=d71c466e-977a-4208-8a10-75063f17000f";
            var request = new XMLHttpRequest();
            request.open('GET', apiUrl, true);
            request.onload = function () {
                if (request.status >= 200 && request.status < 400) {
                    var data = JSON.parse(request.responseText);
                    var details = document.getElementById('route-details');
                    details.textContent = 'Название: ' + data.name + ', Описание: ' + data.description;

                    var button = document.createElement('button');
                    button.textContent = 'Выбрать';
                    button.addEventListener('click', function () {
                        showGuides(selectedRouteId);
                    });
                    details.append(button);
                } else {
                    console.error('Ошибка при получении маршрутов: ' + request.status);
                }
            };
            request.send();
        }


        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            var select = document.getElementById('routes');
            select.innerHTML = '<option value="">Выберите маршрут</option>';
            data.forEach(route => {
                var option = document.createElement('option');
                option.value = route.id;
                option.textContent = route.name;
                select.append(option);
            });
            select.addEventListener('change', displayRouteDetails);
        } else {
            console.error('Ошибка при получении маршрутов: ' + request.status);
        }
    };
    request.send();
}

// Функция для поиска маршрута
function searchRoute() {
    // Получаем идентификатор выбранного маршрута из элемента ввода с идентификатором 'route-id'
    var selectedRouteId = document.getElementById('routes').value;

    // Создаем URL для запроса к API, добавляя идентификатор выбранного маршрута к базовому URL
    var guidesUrl = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/" + selectedRouteId + "/guides";

    // Создаем новый объект XMLHttpRequest для выполнения запроса к API
    var guidesRequest = new XMLHttpRequest();

    // Открываем новый GET-запрос к указанному URL
    guidesRequest.open('GET', guidesUrl, true);

    // Добавляем заголовок Authorization с вашим API-ключом
    guidesRequest.setRequestHeader('Authorization', 'Bearer d71c466e-977a-4208-8a10-75063f17000f');

    // Устанавливаем обработчик события 'load' для запроса
    guidesRequest.onload = function () {
    // Если статус ответа находится в диапазоне от 200 до 399, это означает, что запрос был успешным
        if (guidesRequest.status >= 200 && guidesRequest.status < 400) {
        // Парсим ответ от сервера как JSON
            var guidesData = JSON.parse(guidesRequest.responseText);

            // Получаем элемент списка гидов по идентификатору 'guides-list'
            var guidesList = document.getElementById('guides-list');

            // Очищаем список гидов
            guidesList.innerHTML = '';

            // Проходим по всем гидам в ответе от сервера
            for (var i = 0; i < guidesData.length; i++) {
            // Получаем текущего гида
                var guide = guidesData[i];

                // Создаем новый элемент списка
                var listItem = document.createElement('li');

                // Устанавливаем текст элемента списка равным имени гида
                listItem.textContent = guide.name;
                // Добавляем элемент списка в список гидов
                guidesList.appendChild(listItem);
            }
        } else {
            // Если статус ответа находится вне диапазона от 200 до 399, это означает, что произошла ошибка
            console.error('Ошибка сервера: ' + guidesRequest.status);
        }
    };

    // Устанавливаем обработчик события 'error' для запроса
    guidesRequest.onerror = function() {
        // Выводим сообщение об ошибке в консоль
        console.error('Ошибка при выполнении запроса');
    };

    // Отправляем запрос
    guidesRequest.send();
}

document.getElementById('search-button').addEventListener('click', searchRoute);


// Добавление обработчика событий к кнопке "Поиск"
document.addEventListener('DOMContentLoaded', function() {
    var searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', searchRoute);
    } else {
        console.error('Элемент с идентификатором "search-button" не найден на странице');
    }

    // Получение элемента select с маршрутами
    var routeSelect = document.getElementById('route-id');

    // Добавление обработчика событий для вызова функции showGuides при выборе маршрута
    if (routeSelect) {
        routeSelect.addEventListener('change', function() {
            var selectedRouteId = this.value;
            var url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/' + selectedRouteId + '/guides?api_key=d71c466e-977a-4208-8a10-75063f17000f';
            // Затем используйте url для выполнения запроса
        });
    } else {
        console.error('Элемент с идентификатором "routes" не найден на странице');
    }
});
function displayRouteDetails() {
    var select = document.getElementById('routes');
    var selectedRouteId = select.value;
    var selectedRoute = select.options[select.selectedIndex].text;

    var apiUrl = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/" + selectedRouteId + "?api_key=d71c466e-977a-4208-8a10-75063f17000f";
    var request = new XMLHttpRequest();
    request.open('GET', apiUrl, true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            var details = document.getElementById('route-details');
            details.textContent = 'Название: ' + data.name + ', Описание: ' + data.description;

            var button = document.createElement('button');
            button.textContent = 'Выбрать';
            button.addEventListener('click', function () {
                showGuides(selectedRouteId);
            });
            details.append(button);
        } else {
            // eslint-disable-next-line max-len
            console.error('Ошибка при получении подробных данных о маршруте: ' + request.status);
        }
    };
    request.send();
}

fetchRoutes();

$(document).ready(function() {
    $(".btn-primary").click(function() {
        $("#orderModal").modal('show');
    });
});


// eslint-disable-next-line max-len
function calculatePrice(guideServiceCost, hoursNumber, isThisDayOff, startTime, numberOfVisitors, isPensioner, isTransfer) {
    // Множитель для выходных и праздничных дней
    var dayOffMultiplier = isThisDayOff ? 1.5 : 1;

    // Надбавка за раннее время
    var isItMorning = (startTime >= 9 && startTime < 12) ? 400 : 0;

    // Надбавка за вечернее время
    var isItEvening = (startTime >= 20 && startTime < 23) ? 1000 : 0;

    // Надбавка за количество посетителей
    var visitorsFee;
    if (numberOfVisitors <= 5) {
        visitorsFee = 0;
    } else if (numberOfVisitors <= 10) {
        visitorsFee = 1000;
    } else if (numberOfVisitors <= 20) {
        visitorsFee = 1500;
    }

    // Расчет стоимости
    // eslint-disable-next-line max-len
    var price = guideServiceCost * hoursNumber * dayOffMultiplier + isItMorning + isItEvening + visitorsFee;

    // Применение скидки для пенсионеров
    if (isPensioner) {
        price *= 0.75;
    }

    // Учет стоимости трансфера
    if (isTransfer) {
        price *= isThisDayOff ? 1.25 : 1.3;
    }

    return price;
}


$(document).ready(function() {
    $(".btn-primary").click(function() {
        $("#orderModal").modal('show');
    });
});

// eslint-disable-next-line max-len
document.getElementById('orderModal').addEventListener('submit', function(event) {
    event.preventDefault();

    // Сбор данных формы
    var data = {
        routeName: document.getElementById('routeName').value,
        guideName: document.getElementById('guideName').value,
        excursionDate: document.getElementById('excursionDate').value,
        startTime: document.getElementById('startTime').value,
        duration: document.getElementById('duration').value,
        groupSize: document.getElementById('groupSize').value,
        isPensioner: document.getElementById('isPensioner').checked,
        isTransfer: document.getElementById('isTransfer').checked,
    };
    // Расчет стоимости
    // eslint-disable-next-line max-len
    data.totalCost = calculatePrice(/* здесь должны быть переданы параметры для расчета стоимости */);

    // Отправка данных на сервер
    fetch('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer d71c466e-977a-4208-8a10-75063f17000f'
        },
        body: JSON.stringify(data)
    }).then(function(response) {
        if (response.ok) {
            // Заявка успешно отправлена
            alert('Заявка успешно отправлена!');
        } else {
            // Произошла ошибка
            alert('Произошла ошибка при отправке заявки.');
        }
    });
});


// Вызов функций при загрузке страницы
window.onload = function() {
    fetchRoutes();
};