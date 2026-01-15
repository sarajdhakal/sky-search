"use client";

export function FlightSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Airline */}
        <div className="flex items-center gap-3 lg:w-40">
          <div className="w-10 h-10 bg-slate-200 rounded-lg" />
          <div>
            <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
            <div className="h-3 w-16 bg-slate-100 rounded" />
          </div>
        </div>

        {/* Times */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="h-6 w-16 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-10 bg-slate-100 rounded" />
            </div>

            <div className="flex-1 px-4">
              <div className="h-3 w-16 bg-slate-100 rounded mx-auto mb-2" />
              <div className="h-0.5 bg-slate-200 rounded-full" />
            </div>

            <div className="text-center">
              <div className="h-6 w-16 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-10 bg-slate-100 rounded" />
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex lg:flex-col items-center lg:items-end justify-between lg:ml-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <div>
            <div className="h-8 w-20 bg-slate-200 rounded mb-2" />
            <div className="h-3 w-24 bg-slate-100 rounded" />
          </div>
          <div className="h-10 w-24 bg-slate-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function FlightSkeletonList() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-5 w-32 bg-slate-200 rounded mb-2" />
          <div className="h-4 w-48 bg-slate-100 rounded" />
        </div>
        <div className="h-10 w-48 bg-slate-200 rounded-lg" />
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <FlightSkeleton key={i} />
      ))}
    </div>
  );
}
