const getMonthName = (numMonth) => {
  const arrMonth = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return arrMonth[numMonth];
};

const convertDateToLong = (date) => {
  const d = new Date(date);
  const dtf = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const [
    { value: month },
    ,
    { value: day },
    ,
    { value: year },
  ] = dtf.formatToParts(d);

  return `${day} ${month} ${year}`;
};

export { convertDateToLong, getMonthName };
