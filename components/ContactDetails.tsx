import { Button } from "@/components/ui/button";
import { CSVLink } from "react-csv";
import { ChangeHistory } from "@/components/ChangeHistory";
import { format } from "date-fns";

interface Activity {
  id: number;
  title: string;
  date: string;
  website?: string;
  activityType?: {
    name: string;
  } | null;
}

interface ActivityParticipation {
  id: number;
  activity: Activity;
  role?: string;
  attendance?: boolean;
}

interface Organization {
  id: number;
  acronym: string;
  fullName: string;
  regionalName: string;
  website: string;
  country: string;
}

interface Sector {
  id: number;
  name: string;
}

interface Terms {
  id: number;
  description: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  organizationId: number;
  projectParticipation: boolean;
  sector: Sector;
  organization: Organization;
  activityParticipation: Array<ActivityParticipation>;
  acceptedTerms: Terms | null;
  termsId: number | null;
}

interface Props {
  contact: Contact | undefined;
}

function ContactDetails({ contact }: Props) {
  if (!contact) {
    return <div>No contact details available</div>;
  }

  const headers = [
    "name",
    "email",
    "organizationFullName",
    "organizationAcronym",
    "projectParticipation",
    "termsAccepted",
    "sector",
    "country"
  ];
  
  const csvdata = [[
    contact.name,
    contact.email,
    contact.organization?.fullName,
    contact.organization?.acronym,
    contact.projectParticipation ? "Yes" : "No",
    contact.acceptedTerms ? "Yes" : "No",
    contact.sector?.name || "N/A",
    contact.organization?.country || "N/A"
  ]];

  return (
    <div className="flex flex-col gap-10 items-center p-6">
      <div className="flex justify-between p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600 w-3/4">
        <div className="flex flex-col gap-2 w-full items-center bg-gray-800 p-5">
          <span className="text-xl font-semibold">{contact.name}</span>
          <span className="text-sm font-medium">{contact.email}</span>
          <span className="text-sm text-gray-300">
            Organization: {contact.organization.fullName}
          </span>
          {contact.sector && (
            <span className="text-sm text-gray-300">
              Sector: {contact.sector.name}
            </span>
          )}
          <div className="mt-2 text-sm">
            <span className="font-medium">Terms Status: </span>
            {contact.acceptedTerms ? (
              <div className="text-green-400">
                <span>Terms Accepted</span>
                <p className="text-xs mt-1 text-gray-400">{contact.acceptedTerms.description}</p>
              </div>
            ) : (
              <span className="text-yellow-400">No terms accepted</span>
            )}
          </div>
          {contact.projectParticipation && (
            <div className="mt-2 px-3 py-1 bg-green-600 rounded-full text-xs font-semibold">
              Project Participant
            </div>
          )}
        </div>
      </div>

      {contact.id && (
        <div className="w-3/4">
          <ChangeHistory type="contact" id={contact.id} />
        </div>
      )}

      <div>
        <div className="flex flex-col justify-center items-center">
          <Button variant="secondary" onClick={() => window.history.back()}>
            Back to results
          </Button>
          <h1 className="mt-4 text-xl font-semibold">Activity Participation</h1>
        </div>
      </div>

      <div className="w-3/4">
        {contact.activityParticipation && contact.activityParticipation.length > 0 ? (
          contact.activityParticipation.map((participation, index) => (
            <div
              key={index}
              className="p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600"
            >
              <div className="flex flex-col gap-2 items-center text-center">
                <span className="text-xl font-semibold">
                  {participation.activity.title}
                </span>
                <span className="text-sm">
                  {participation.activity.activityType?.name || 'Unknown Type'}
                </span>
                <span className="text-sm">
                  {format(new Date(participation.activity.date), 'PPP')}
                </span>
                {participation.role && (
                  <span className="text-sm">Role: {participation.role}</span>
                )}
                {participation.activity.website && (
                  <a 
                    href={participation.activity.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-semibold hover:text-blue-400"
                  >
                    {participation.activity.website}
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center text-slate-300 text-2xl">
            No activity found
          </div>
        )}
      </div>

      <div className="mt-4">
        <Button variant="outline">
          <CSVLink
            data={csvdata}
            headers={headers}
            filename={`contact_${contact.name}.csv`}
            className="text-gray-800"
          >
            Download Contact Info
          </CSVLink>
        </Button>
      </div>
    </div>
  );
}

export default ContactDetails;