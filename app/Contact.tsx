interface ContactProps {
  contact: {
    id: number;
    name: string;
    email: string;
    organizationId: number;
    projectParticipation: boolean;
    isActive: boolean;
  }| Array<{
    id: number;
    name: string;
    email: string;
    organizationId: number;
    projectParticipation: boolean;
    isActive: boolean;
  }>;
}
const Contact: React.FC<ContactProps> = ({ contact }) => {
  if (Array.isArray(contact)) {
    // if array, map and render each element
    return (
      <>
        {contact.map((contact) => (
          <div key={contact.id} className="p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600">
            <div className="flex flex-col gap-2 items-center">
              <span className="text-xl font-semibold">{contact.name}</span>
              {contact.email}
              <span className="text-xs font-semibold">
                {contact.projectParticipation}
              </span>
            </div>
          </div>
        ))}
      </>
    );
  } else {
    // if object, just render it
    return (
      <div key={contact.id} className="p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600">
        <div className="flex flex-col gap-2 items-center">
          <span className="text-xl font-semibold">{contact.name}</span>
          {contact.email}
          <span className="text-xs font-semibold">
            {contact.projectParticipation}
          </span>
        </div>
      </div>
    );
  }
};

export default Contact;
