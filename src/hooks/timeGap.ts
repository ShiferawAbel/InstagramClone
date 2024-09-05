const timeGap = (createdAt: string) => {
  const createdYear = parseInt(createdAt.substring(0, 4));
  const createdMonth = parseInt(createdAt.substring(5, 7));
  const createdDay = parseInt(createdAt.substring(8, 10));
  const createdHour = parseInt(createdAt.substring(11, 13));
  const createdMin = parseInt(createdAt.substring(14, 16));
  const createdSec = parseInt(createdAt.substring(17, 19));

  const now = Date.now();
  const currentTime = new Date(now).toISOString();
  const currentYear = parseInt(currentTime.substring(0, 4));
  const currentMonth = parseInt(currentTime.substring(5, 7));
  const currentDay = parseInt(currentTime.substring(8, 10));
  const currentHour = parseInt(currentTime.substring(11, 13));
  const currentMin = parseInt(currentTime.substring(14, 16));
  const currentSec = parseInt(currentTime.substring(17, 19));

  if (currentYear === createdYear) {
    if (currentMonth === createdMonth) {
      if (currentDay === createdDay) {
        if (currentHour === createdHour) {
          if (currentMin === createdMin) {
            if (currentSec === createdSec) {
              return "Now";
            } else {
              return currentSec - createdSec + " seconds ago";
            }
          } else {
            return currentMin - createdMin + " min ago";
          }
        } else {
          return currentHour - createdHour + " hours ago";
        }
      } else {
        return currentDay - createdDay + " days ago";
      }
    } else {
      return currentMonth - createdMonth + " months ago";
    }
  } else {
    return currentYear - createdYear + " years ago";
  }

  // (createdYear, createdMonth, createdDay, createdHour, createdMin, createdSec)
};

export default timeGap