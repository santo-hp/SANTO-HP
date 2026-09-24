export type JobCard = {
  id: number;
  company: string;
  title: string;
  image: string | null;
  salary: string;
  type: string;
  shift: string;
  access: string;
};
export type JobResults = { jobs: JobCard[]; total: number; page: number; pages: number };
