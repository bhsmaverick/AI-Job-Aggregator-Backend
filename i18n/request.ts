import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  // Fallback to default locale if missing or invalid
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  
  try {
    const messages = (await import(`../messages/${locale}.json`)).default;
    return { locale, messages };
  } catch (error) {
    const messages = (await import(`../messages/en.json`)).default;
    return { locale, messages };
  }
});
