/**
 * Implement a standard function to call web service
 * and checking the browser cache. If refresh is false
 * then use cache data. Otherwise, call the web service.
 * 
 */

export const getJson = (url: URL, refresh = false): Promise<any> => {
  const key = url.toString();
  const storage = window.sessionStorage;
  const d = storage.getItem(key);
  if (!refresh && d != null) {
    return Promise.resolve(JSON.parse(d));
  } else
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        storage.setItem(key, JSON.stringify(data));
        return data;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
};


export const getJson2 = async (url: URL, refresh = false): Promise<any> => {
  const key = url.toString();
  const storage = window.sessionStorage;
  const d = storage.getItem(key);
  if (!refresh && d != null)
    return JSON.parse(d);

  try {
    const response = await fetch(url);
    const data = await response.json();
    storage.setItem(key, JSON.stringify(data));
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }

};

export const getXml = (url: URL) => {
  return fetch(url)
    .then((response) => response.text())
    .then((str) => new window.DOMParser().parseFromString(str, "text/xml"));
};

type GetInitRequestFunc = (data: any) => RequestInit;

const getInit: GetInitRequestFunc = (data) => ({
  // Default options are marked with *
  method: "GET", // *GET, POST, PUT, DELETE, etc.
  mode: "cors", // no-cors, *cors, same-origin
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  credentials: "same-origin", // include, *same-origin, omit
  headers: {
    "Content-Type": "application/json",
    // 'Content-Type': 'application/x-www-form-urlencoded',
  },
  redirect: "follow", // manual, *follow, error
  // no-referrer, *no-referrer-when-downgrade, origin,
  // origin-when-cross-origin, same-origin, strict-origin,
  // strict-origin-when-cross-origin, unsafe-url
  referrerPolicy: "no-referrer",
  // body data type must match "Content-Type" header
  body: JSON.stringify(data),
});
