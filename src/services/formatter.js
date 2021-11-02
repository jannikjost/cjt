export { formatOvertime, formatDateMonthYear, formatDateDayMonthYear };

function formatOvertime(time) {
  if (!time) return;
  time = (time / 60).toString();
  const seperator = ":";
  const i = time.toString().indexOf(".");
  // Not an odd value
  if (i < 0) {
    return time + seperator + "00";
  }
  const hours = time.substring(0, i);
  const minutes = time.substring(i + 1, time.length);
  var formattedMinutes;
  switch (minutes) {
    case "25":
      formattedMinutes = "15";
      break;
    case "5":
      formattedMinutes = "30";
      break;
    case "75":
      formattedMinutes = "45";
      break;
    default:
      break;
  }
  return hours + seperator + formattedMinutes;
}

//TODO dry monthnames
function formatDateMonthYear(date) {
  const monthNames = [
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
  const year = date.getFullYear();
  const month = monthNames[date.getMonth()];
  return month + " " + year;
}

function formatDateDayMonthYear(date) {
  const monthNames = [
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
  const year = date.getFullYear();
  const month = monthNames[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  return day + " " + month + " " + year;
}
