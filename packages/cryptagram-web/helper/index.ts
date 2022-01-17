export const api = async (url: string, data?: any) => {
  data = { method: "post", ...data };
  data.body = data.body ? JSON.stringify(data.body) : data.body;
  let resp = await fetch(url, data);
  if (resp.ok) {
    return resp.json();
  } else {
    console.log("client<->server error ==> ", resp);
    return Promise.reject({
      message: "Something went wrong client<->server!",
      success: false,
    });
  }
};

export const getTimeAgo = (dateStr: string): string => {
  if (window.dates && window.dates[dateStr]) {
    return window.dates[dateStr];
  } else if (!window.dates) {
    window.dates = {};
  }

  let intDate = new Date(Number(dateStr));
  let cDate = new Date();
  let diffDate = cDate.valueOf() - intDate.valueOf();

  let minutesPassed = diffDate / 1000 / 60;
  let hoursPassed = diffDate / 1000 / 60 / 24;
  let daysPassed = diffDate / 1000 / 60 / 60 / 24;
  let weeksPassed = diffDate / 1000 / 60 / 60 / 24 / 7;
  let monthsPassed = diffDate / 1000 / 60 / 60 / 24 / 7 / 30;
  let yearsPassed = diffDate / 1000 / 60 / 60 / 24 / 7 / 30 / 12;

  let str = "";

  if (minutesPassed < 1) {
    str = "A few seconds ago";
  } else if (minutesPassed < 60) {
    str = `${Math.round(minutesPassed)} minute(s) ago`;
  } else if (hoursPassed < 24) {
    str = `${Math.round(hoursPassed)} hour(s) ago`;
  } else if (daysPassed < 7) {
    str = `${Math.round(daysPassed)} day(s) ago`;
  } else if (weeksPassed < 4) {
    str = `${Math.round(weeksPassed)} week(s) ago`;
  } else if (monthsPassed < 12) {
    str = `${Math.round(monthsPassed)} month(s) ago`;
  } else {
    str = `${yearsPassed} years(s) ago`;
  }
  window.dates[dateStr] = str;
  return str;
};
