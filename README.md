### установка

- Запуск сервисов (mongo и redis)
```docker-compose up -d```

- Создание БД
```npm run migrate```

- подтягиваем зависимости
```npm install```

- поднимаем бэк:

в хроме:
chrome://flags/#allow-insecure-localhost (у нас самоподписанный сертификат)

```npm run start```

### API

- /addUrl post
  payload: {full: 'url'} - генерит сокращение сам
  возвращает:
  {ok: 200, short: 'сокращение для урла (без домена, только subpart)'} - если все прошло ок
  {err: 'can`t generate unique id'} - если после 5 попыток не удалось сгенерить уникальный id

  payload: {full: 'url', short: 'вариант введенный пользователем'} - пытается сохранить альяс пользователя
  возвращает:
  {ok: 200, short: 'сокращение для урла (без домена, только subpart)'} - если все прошло ок
  {err: 'already exists'} - если указанное сокращение уже используется

  если ошибки не было - err в ответе отсутствует, то есть можно положиться на проверку наличия поля.

- /getAllUrls post
  payload - отсутствует. Возвращает массив альясов, введенных этим пользователем (по session id) в формате:
  [{full: 'full urls', short: 'short url'} ...]

- /[любая другая комбинация символов] get
  если для этой комбинации есть альяс - происходит редирект (302)
  иначе - 404

getAllUrls сделан через post что бы не конфликтовать с функционалом редиректа. То есть в дальнейшем если необходимо будет расширять api, новые эндпоинты также надо вешать га post

порты для сервисов нужно прописывать в двух местах - в docker-compose - для проброса портов из образа и configs - что бы бэк знал куда стучаться.

по адресу https://localhost:3000/index.html доступна форма для простого теста бэка.
