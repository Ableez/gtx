import Loading from "@/app/loading";
import { User } from "../../../../types";
import Usercard from "../Usercard";
import { Accordion } from "@/components/ui/accordion";
import { ConversationCollections, TransactionRec } from "../../../../chat";
import { NewType } from "./DisplayUserPage";

type DisplayUserProps = {
  users: NewType[];
  loading: boolean;
  error: string;
};

const DisplayUser = ({ users, loading, error }: DisplayUserProps) => {
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const renderUsers = users.map((user) => (
    <Usercard key={user.id} user={user} />
  ));

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
