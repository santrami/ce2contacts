interface Participation {
  id: number;
  organization: string | undefined;
  event: string | undefined;
  registrationTime: string;
  timeParticipation: number;
}

const Participation = (participation: Participation) => {
  return (
    <div className="p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600">
        <div className="flex flex-col gap-2 items-center text-center">
          <span className="text-xl font-semibold">{participation.event}</span>
          {/*{participation.organization}
           <span className="text-xs font-semibold">
            {new Date(participation.registrationTime).toUTCString().split(" ").slice(0, 5).join(" ")}
          </span>
          <span className="text-xs font-semibold">
            Time in event: {" "} 
            {participation.timeParticipation}
          </span> */}
        </div>
      </div>
  )
};

export default Participation;


/*
if (Array.isArray(participation)) {
    // if array, map and render each element
    return (
      <>
        {participation.map((participation) => (
          <div
            key={participation.id}
            className="p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600"
          >
            <div className="flex flex-col gap-2 items-center">
              <span className="text-xl font-semibold">
                {participation.name}
              </span>
              {participation.email}
              <span className="text-xs font-semibold">
                {participation.projectParticipation}
              </span>
            </div>
          </div>
        ))}
      </>
    );
  } else if (participation) {
    // if object, just render it
    console.log(participation);
    return (
      <div key={participation.id} className="p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600">
        <div className="flex flex-col gap-2 items-center">
          <span className="text-xl font-semibold">{participation.event}</span>
          {participation.organization}
          <span className="text-xs font-semibold">
            {new Date(participation.registrationTime).toUTCString().split(" ").slice(0, 5).join(" ")}
          </span>
          <span className="text-xs font-semibold">
            {participation.timeParticipation}
          </span>
        </div>
      </div>
    )
  } else if(!participation) {
    console.log("hola, hola, hola",participation);
    
    return (
      <div className="p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600">
        <div className="flex flex-col gap-2 items-center">
          <span className="text-xl font-semibold">No activity found</span>
        </div>
      </div>
    );
  }

*/