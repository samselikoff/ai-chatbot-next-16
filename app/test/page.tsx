'use client';

import { useState } from 'react';
import Spinner from '../(main)/_components/Spinner';

export default function Page() {
  const [count, setCount] = useState(1);

  return (
    <div className="m-8">
      <div>
        <button onClick={() => setCount((c) => c + 1)}>Add</button>
      </div>

      <div className="mt-8">
        {Array.from(Array(count).keys()).map((i) => (
          <div key={i}>
            <Spinner className="size-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
