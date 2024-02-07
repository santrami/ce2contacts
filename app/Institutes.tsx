import { organization } from "@prisma/client";

interface organizationProps {
  organization: Array<organization>;
}

const Institutes = ({ organization }: organizationProps) => {
  return (
    <>
      {organization.map((organization, index) => (
        <div key={index} className="flex p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600 w-3/4">
          <div>

          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xl font-semibold">{organization.fullName}</span>
            <a href={organization.website} target="_blank" className="text-xs font-semibold">{organization.website}</a>
            <span className="text-xs font-semibold">{organization.acronym}</span>
            <span className="text-xs font-semibold">{organization.country}</span>
          </div>
        </div>
      ))}
    </>
  );
};

export default Institutes;