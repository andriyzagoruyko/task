export const fetcher = (url: string, init?: RequestInit) =>
  fetch(`http://${window.location.hostname}/api/${url}`, init).then((res) =>
    res.json()
  );
