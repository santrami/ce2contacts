import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Participation {
    id: number;
    contactId:number,
    organizationId: number;
    eventId: number;
    registrationTime: Date;
    timeParticipation: number;
  }

interface ContactProps {
  contact: {
    id: number;
    name: string;
    email: string;
    organizationId: number;
    projectParticipation: boolean;
    isActive: boolean;
    participation: Participation;
  }
}


const Participation: React.FC<ContactProps> = ({ participation }) => {
    console.log("en Participation",participation);
    
  if (Array.isArray(participation)) {
    // if array, map and render each element
    return (
      <>
        {participation.map((participation) => (
          <div key={participation.id} className="p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600">
            <div className="flex flex-col gap-2 items-center">
              <span className="text-xl font-semibold">{participation.name}</span>
              {participation.email}
              <span className="text-xs font-semibold">
                {participation.projectParticipation}
              </span>
            </div>
          </div>
        ))}
      </>
    );
  } else {
    // if object, just render it
    return (
      <div key={participation.id} className="p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600">
        <div className="flex flex-col gap-2 items-center">
          <span className="text-xl font-semibold">{participation.organizationId}</span>
          {participation.email}
          <span className="text-xs font-semibold">
            {participation.projectParticipation}
          </span>
        </div>
      </div>
    );
  }
};

export default Participation;
