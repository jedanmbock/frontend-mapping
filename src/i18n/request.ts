import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async () => {
  const locale = 'fr'; // Langue par défaut, à dynamiser selon les besoins
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
