export default () =>
  typeof window !== 'undefined' && window.navigator && window.navigator.onLine;
