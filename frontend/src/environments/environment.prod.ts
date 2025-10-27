const resolveApiUrl = (): string => {
  if (typeof window === 'undefined') {
    return 'http://localhost:8080';
  }

  const globalApi = (window as any).__ALUGAPLUS_API__;
  if (typeof globalApi === 'string' && globalApi.startsWith('http')) {
    return globalApi;
  }

  const params = new URLSearchParams(window.location.search);
  const apiFromQuery = params.get('api');
  if (apiFromQuery) {
    return apiFromQuery;
  }

  const apiPortFromQuery = params.get('apiPort');
  if (apiPortFromQuery) {
    return `${window.location.protocol}//${window.location.hostname}:${apiPortFromQuery}`;
  }

  const storedApiUrl = window.localStorage.getItem('alugaplus_api_url');
  if (storedApiUrl) {
    return storedApiUrl;
  }

  const storedApiPort = window.localStorage.getItem('alugaplus_api_port');
  if (storedApiPort) {
    return `${window.location.protocol}//${window.location.hostname}:${storedApiPort}`;
  }

  return window.location.origin;
};

export const environment = {
  production: true,
  apiUrl: resolveApiUrl()
};
