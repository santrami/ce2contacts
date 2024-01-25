import { INSTITUTES } from "@prisma/client";

interface InstituteProps {
  institutes: Array<INSTITUTES>;
}

const Institutes = ({ institutes }: InstituteProps) => {
  return (
    <>
      {institutes.map((institute, index) => (
        <div key={index} className="flex p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600 w-3/4">
          <div>

          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xl font-semibold">{institute.full_name}</span>
            <a href={institute.url} target="_blank" className="text-xs font-semibold">{institute.url}</a>
            <span className="text-xs font-semibold">{institute.short_name}</span>
            <span className="text-xs font-semibold">{institute.country}</span>
          </div>
        </div>
      ))}
    </>
  );
};

export default Institutes;