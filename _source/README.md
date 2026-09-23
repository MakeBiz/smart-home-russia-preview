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

## Кейсы
- Реальные кейсы: `_source/content/cases.mjs`, массив `REAL_CASES` (шаблон в комментарии). Новые сверху.
- Фото: `python3 _source/tools/add_case_photos.py <slug> фото1.jpg фото2.jpg ...` → `assets/cases/<slug>/01.webp ...` (ресайз, WebP, EXIF и GPS вырезаются).
- Концепт-проекты (`content/projects.mjs`) показываются после реальных с пометкой «Концепт-проект».
- Страницы: `/cases/` (фильтр по типу) и `/cases/<slug>/` (Задача, Что сделали, Результат, системы со ссылками, галерея, отзыв).

## Новости
- `_source/content/news.mjs`, массив `NEWS` (новые сверху), шаблон в комментарии. Разметка NewsArticle.
- Фото: ключ из photos.txt или `news/<slug>.webp` (`add_case_photos.py --news <slug> фото.jpg`).
- Страницы: `/news/` и `/news/<slug>/`, блок «Новости» на главной появляется сам, когда есть хотя бы одна новость.
