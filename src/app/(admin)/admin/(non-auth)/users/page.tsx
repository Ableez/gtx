"use server";

import React from "react";
import { getUsers } from "@/lib/utils/fetchUsers";
import { AccountDetails } from "../../../../../../types";
import { Conversation, TransactionRec } from "../../../../../../chat";
import Usercard from "@/components/admin/Usercard";
import { Accordion } from "@/components/ui/accordion";
import Link from "next/link";

export type NewType = {
  imageUrl: string;
  savedPayments: boolean;
  role: string;
  disabled: boolean;
  deleted: boolean;
  email: string;
  feedbacks: string[];
  payment: AccountDetails[];
  id: string;
  username: string;
  chats: Conversation[];
  transactions: TransactionRec[];
};

const AdminManageUserPage = async () => {
  const fetchedUsers = await getUsers();

  if (!fetchedUsers) {
    return (
      <div>
        <div>Could not fetch users</div>
        <Link href="/admin/users">Retry</Link>
      </div>
    );
  }

  const users = fetchedUsers as NewType[];

  const renderUsers = users.map((u) => {
    const user = JSON.parse(JSON.stringify(u));
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

export default AdminManageUserPage;
