# Smart Home Russia: сайт

Статический сайт на русском (корень). HTML собирается скриптом, хостинг отдаёт готовые файлы. Дизайн и движок общие с сайтом Smart Home Dubai (папка ../site), контент и калькулятор под Россию.

## Сборка
    node _source/build.mjs

## Где что лежит
- `_source/config.mjs`: бренд, домен, Telegram, телефон, email, адрес формы
- `_source/content/journal.mjs`: статьи (новые сверху)
- `_source/content/projects.mjs`: проекты (`concept: true` для концептов)
- `_source/pages/*.mjs`: страницы
- `_source/photos.txt`: ключ фото | id на Unsplash
- `assets/site.css`, `assets/site.js`: стили и скрипты (калькулятор в рублях, форма, меню)

## Калькулятор
Ставки в `assets/site.js` (объект R), в рублях с НДС. Черновые ориентиры, перед рекламой сверить с партнёром.
