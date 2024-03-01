import Loading from "@/app/loading";
import Usercard from "../Usercard";
import { Accordion } from "@/components/ui/accordion";
import { NewType } from "./DisplayUserPage";

type DisplayUserProps = {
  users: NewType[];
  loading: boolean;
  error: string;
};

const DisplayUser = ({ users, loading, error }: DisplayUserProps) => {
  if (error) {
    return <div>{error}</div>;
  }

  const renderUsers = users.map((user) => {
    if (user.role !== "admin") {
      return <Usercard key={user.id} user={user} />;
    } else {
      return null;
    }
  });

  return (
    <div>
      {users.length > 0 ? (
        <Accordion type="single" collapsible className="mx-auto max-w-md">
          {renderUsers}
        </Accordion>
      ) : (
        <div>No users found</div>
      )}
    </div>
  );
};

export default DisplayUser;
