import { OrganizationList } from "./OrganizationList";

interface OrganizationProps {
  organization: any[];
  totalPages: number;
  currentPage: number;
}

const Organization = ({ organization, totalPages, currentPage }: OrganizationProps) => {
  return (
    <OrganizationList
      organizations={organization}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={() => {}}
      onTagsUpdate={() => {}}
    />
  );
};

export default Organization;