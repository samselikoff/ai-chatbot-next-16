'use client';

import { useState } from 'react';
import Spinner from '../(main)/_components/Spinner';
import { Pulse } from '../(main)/_components/Pulse';

export default function Page() {
  const [count, setCount] = useState(0);

  return (
    <div className="m-8">
      <button onClick={() => setCount((c) => c + 1)}>Add</button>

      <div className="mt-8">
        {Array.from(Array(count).keys()).map((i) => (
          <div key={i}>
            <Pulse />
          </div>
        ))}
      </div>
    </div>
  );
}
