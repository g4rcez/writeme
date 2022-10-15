import { FormEvent } from "react";

export default function DashboardDocumentsPage() {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="container w-full mx-auto">
      <form></form>
    </div>
  );
}
