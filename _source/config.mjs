// Global site settings. Change the brand, contacts and domain here, then rebuild.
export const SITE = {
  brand: 'Smart Home',
  domain: 'https://smarthome-russia.ru', // replace with the real domain before launch
  // false = noindex on every page (preview on github.io). Switch to true when the real domain is live.
  indexable: false,
  // Analytics and webmaster verification: fill in after the domain is connected
  metrika: 0,
  yandexVerification: '',
  googleVerification: '',
  // Social profiles of the brand (VK, Telegram channel, Dzen...) for Organization.sameAs
  sameAs: [],
  // Contacts. Leave empty to hide. Telegram: username without @. Phone: +7 ...
  telegram: '',
  phone: '',
  email: '',
  address: 'Россия',
  // Юрлицо для политики конфиденциальности, например: ООО «...», ИНН ...
  legalName: '',
  // Lead endpoint: relay that sends the lead to Telegram and Bitrix24
  formEndpoint: 'https://smart-home-leads.vercel.app/api/lead',
  hours: 'Пн-Пт 9:00-20:00, Сб 10:00-16:00',
};
