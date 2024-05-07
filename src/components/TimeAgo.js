import { useState, useEffect } from 'react';

const secondsTable = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['week', 60 * 60 * 24 * 7],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
];
const rtf = new Intl.RelativeTimeFormat(undefined, {numeric: 'auto'});

function getTimeAgo(date) {
  const seconds = Math.round((date.getTime() - new Date().getTime()) / 1000);
  const absSeconds = Math.abs(seconds);
  let bestUnit, bestTime, bestInterval;
  for (let [unit, unitSeconds] of secondsTable) {
    if (absSeconds >= unitSeconds) {
      bestUnit = unit;
      bestTime = Math.round(seconds / unitSeconds);
      bestInterval = Math.min(unitSeconds / 2, 60 * 60 * 24);
      break;
    }
  };
  if (!bestUnit) {
    bestUnit = 'second';
    bestTime = parseInt(seconds / 10) * 10;
    bestInterval = 10;
  }
  return [bestTime, bestUnit, bestInterval];
}

export default function TimeAgo({ isoDate }) {
  const date = new Date(Date.parse(isoDate));
  const [time, unit, interval] = getTimeAgo(date);
  const [, setUpdate] = useState(0);

  useEffect(() => {
    const timerId = setInterval(
      () => setUpdate(update => update + 1),
      interval * 1000
    );
    // Sometimes, side effect functions
    // allocate resources, such as the interval timer
    // here, and these resources need to be released
    // when the component is removed from the page, to
    // avoid resource leaks. When a side effect function
    // returns a function, React calls this function to
    // allow the component to perform any necessary clean
    // up tasks. For this component, the side effect clean
    // up function cancels the interval timer.
    return () => clearInterval(timerId);
    // Why can React realize there is a change in the interval compared to its
    // previous values, since interval here is a const? The answer is that
    // even though interval is a const, its value is a primitive value, which
    // is passed by value. When the component's props change, React will
    // create a new props object and pass it to the component's render function.
    // When the render function receives the new props, it will see that
    // interval has changed from the previous value, and run the side effect
    // function again.
  }, [interval]);

  return (
    <span title={date.toString()}>{rtf.format(time, unit)}</span>
  );
}
