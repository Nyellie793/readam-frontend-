export default function DailyStreak() {
    return (
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm font-bold">
          Daily Streak
        </p>
  
        <div className="mt-3 flex items-center gap-3">
          <span className="text-4xl font-extrabold text-orange-500">
            7
          </span>
  
          <p className="text-xs text-gray-500">
            Days of consistent learning.
          </p>
        </div>
  
        <div className="mt-4 flex justify-between">
          {["M","T","W","T","F","S","S"].map((day, index)=>(
            <span
              key={`${day}-${index}`}
              className="
              flex
              size-7
              items-center
              justify-center
              rounded-full
              bg-orange-500
              text-[11px]
              text-white
              "
            >
              {day}
            </span>
          ))}
        </div>
      </div>
    );
  }