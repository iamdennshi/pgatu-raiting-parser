### Описание

Скрипт который выводит в терминал место в рейтинге и общее количество мест в конкурсном списке

### Конфигурация

В файле `.env`

- SNILS - снилс
- CONCOURSE_ID - ИД направления. Можно получить на [этой страницы](https://pgsha.ru/candidate/rating_all/). Перед тем как выбриать конкрус нужно зайти в DevTools во вкладку `Network`. Выбрать конкурс. Открыть запрос `view_grid` и во вкладке `payload` получить `concourse_id`
  ![alt text](image.png)

### Требуется

```
nodejs >= 20.6.0
```

### Простое использование

```
node --env-file=.env main.js
```

### Запуск из терминала

Файл `pgatu.bat` позволяет запускать скрипт вводя в терминал windows `pgatu`. При этом файлы должны находиться в директории, которая записана в переменной среды (PATH)
