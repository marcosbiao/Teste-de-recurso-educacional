import * as React from 'react';

interface SegmentedProgressProps {
  completed: number;
  total: number;
  label: string;
}

export function SegmentedProgress({ completed, total, label }: SegmentedProgressProps) {
  return (
    <div className="segmented-progress" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={completed} aria-label={label}>
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={index < completed ? 'is-complete' : undefined} />
      ))}
    </div>
  );
}
