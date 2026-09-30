import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="rounded-3xl overflow-hidden glass-card h-[480px] p-4 flex flex-col justify-between relative">
      <div className="w-full h-full skeleton rounded-2xl mb-4" />
      <div className="space-y-3 absolute bottom-6 left-6 right-6">
        <div className="h-6 w-3/4 skeleton rounded-lg" />
        <div className="h-4 w-full skeleton rounded-lg" />
        <div className="flex gap-2 pt-2">
          <div className="h-8 w-1/2 skeleton rounded-xl" />
          <div className="h-8 w-1/2 skeleton rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
