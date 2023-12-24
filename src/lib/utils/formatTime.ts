export const formatTime = (dateString: string): string => {
  // Parse the date string into a Date object
  const messageDate = new Date(dateString);

  // Get the time difference in milliseconds
  const difference = Date.now() - messageDate.getTime();

  // Determine the appropriate formatted time string
  if (difference < 60000) {
    return "just now";
  } else if (difference < 3600000) {
    const minutes = Math.floor(difference / 60000);
    return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
  } else if (difference < 86400000) {
    const hours = Math.floor(difference / 3600000);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (difference < 172800000) {
    return "Yesterday";
  } else if (difference < 259200000) {
    const days = Math.floor(difference / 86400000);
    return `${days} days ago`;
  } else {
    // Use a locale-aware method for formatting time
    return `${messageDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })} on ${messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }
};
