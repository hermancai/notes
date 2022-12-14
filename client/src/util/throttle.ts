// HOF for delaying function calls
const throttle = (func: () => void, delay: number) => {
  let inProgress = false;
  return () => {
    if (inProgress) {
      return;
    }
    inProgress = true;
    func();
    setTimeout(() => {
      func();
      inProgress = false;
    }, delay);
  };
};

export default throttle;
