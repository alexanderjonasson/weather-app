function getGeolocationMessage(errorCode) {
  if (errorCode === 1) {
    return "Location access was denied. Allow location access in your browser.";
  }

  if (errorCode === 2) {
    return "Your position couldn't be determined.";
  }

  if (errorCode === 3) {
    return "Getting your position took too long.";
  }

  return "Couldn't get your position.";
}

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Your browser doesn't support geolocation."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => reject(new Error(getGeolocationMessage(error.code))),
      { timeout: 10000 },
    );
  });
}
