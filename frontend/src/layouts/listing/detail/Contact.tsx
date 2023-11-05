import { EnvelopeIcon } from "@heroicons/react/24/outline";

type ContactProps = {
  email: string;
};

export const Contact = ({ email }: ContactProps) => {
  return (
    <div className="rounded-lg bg-white px-10 py-8">
      <h2 className=" pb-2 font-medium">Contact</h2>
      <div className="flex items-center">
        <EnvelopeIcon className="h-5 w-5" />
        <p className="pl-2">{email}</p>
      </div>
    </div>
  );
};
