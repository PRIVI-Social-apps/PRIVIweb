import React, { useEffect, useState } from 'react';

export default function RewardsGraph() {
  const [long, setLong] = useState<number>(0);
  const circumference = 2 * 3.14 * 80;

  useEffect(() => {
    let minutesNow = new Date().getMinutes();

    const percMinutesNow = 100 - ((60 - minutesNow) / 60) * 100;

    let strokeLength = (circumference / 100) * percMinutesNow;

    setLong(strokeLength);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rewards-graph">
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        transform="rotate(-90)"
      >
        <circle
          className="radial-chart-total"
          stroke={'#EEF1F4'}
          strokeWidth={30}
          fill="none"
          cx="100"
          cy="100"
          r="80"
        />
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke={'#64C89E'}
          strokeWidth={30}
          strokeDasharray={`${long},${circumference}`}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
