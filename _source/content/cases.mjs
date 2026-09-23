// Real cases. Newest first. Photos go to assets/cases/<slug>/ (01.webp, 02.webp ...), see tools/add_case_photos.py
// Concept projects from projects.mjs are shown after real cases, clearly labelled.
//
// Template (copy, fill, rebuild):
// {
//   slug: 'dom-istra-280',                 // latin, becomes /cases/dom-istra-280/
//   date: '2026-10-01',                    // publication date
//   type: 'house',                         // house | apartment | office | banya | territory
//   title: 'Загородный дом 280 м² в Истре',
//   excerpt: 'Одно-два предложения: что сделали и что изменилось для семьи.',
//   city: 'Истра, Московская область',
//   area: '280 м²',
//   year: '2025',
//   duration: '6 недель',
//   budget: '3,2 млн ₽',                   // optional, '' to hide
//   systems: ['heating', 'kotel-udalenno', 'banya', 'umnye-vorota', 'videonablyudenie'], // links to solution pages
//   photo: 'cases/dom-istra-280/01.webp',  // cover
//   gallery: ['cases/dom-istra-280/02.webp', 'cases/dom-istra-280/03.webp'],
//   task: '<p>Что было и что хотел заказчик.</p>',
//   solution: '<ul><li>Что сделали</li></ul>',
//   result: '<p>Что изменилось: цифры, экономия, сроки.</p>',
//   quote: { text: 'Отзыв заказчика', author: 'Имя, кто он' }, // optional, only with the client's consent
// }
export const REAL_CASES = [];

export const CASE_TYPES = {
  house: 'Загородный дом', apartment: 'Квартира', office: 'Офис', banya: 'Баня и спа', territory: 'Участок',
};
