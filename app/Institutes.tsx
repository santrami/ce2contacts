import { INSTITUTES } from "@prisma/client";
import Link from "next/link";

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
            {/* <Link href={institute.url} className="text-xs font-semibold">{institute.url}</Link> */}
            <span className="text-xs font-semibold">{institute.country}</span>
            {/* <span className="text-xs font-semibold">{institute.short_name}</span> */}
          </div>
        </div>
      ))}
    </>
  );
};

export default Institutes;