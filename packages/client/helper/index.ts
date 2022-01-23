export const api = async (url: string, data?: any) => {
  data = { method: "post", ...data };
  data.body = data.body ? JSON.stringify(data.body) : data.body;
  let resp = await fetch(url, data);
  if (resp.ok) {
    return resp.json();
  } else {
    console.log("client<->server error ==> ", resp);
    let message = "Something went wrong client<->server!";
    // if (resp.status === 403) {
    //   message = "forbidden";
    // }
    return Promise.reject({
      message: message,
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
  let hoursPassed = minutesPassed / 60;
  let daysPassed = hoursPassed / 24;
  let weeksPassed = daysPassed / 7;
  let monthsPassed = weeksPassed / 30;
  let yearsPassed = monthsPassed / 12;

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
