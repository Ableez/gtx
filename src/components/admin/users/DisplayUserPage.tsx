"use client";

import React, { useState, useEffect } from "react";
import { AccountDetails, User } from "../../../../types";
import Loading from "@/app/loading";
import { getUsers } from "@/lib/utils/fetchUsers";
import DisplayUser from "./DisplayUser";
import { Conversation, TransactionRec } from "../../../../chat";

export type NewType = {
  imageUrl: string;
  savedPayments: boolean;
  role: string;
  email: string;
  payment: AccountDetails[];
  id: string;
  username: string;
  chats: Conversation[];
  transactions: TransactionRec[];
};

const DisplayUserPage = () => {
  const [users, setUsers] = useState<NewType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await getUsers();
        console.log(fetchedUsers);
        setUsers(fetchedUsers as NewType[]);
      } catch (error) {
        setError("An error occured while fetching users");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <DisplayUser users={users as NewType[]} error={error} loading={loading} />
    </div>
  );
};

export default DisplayUserPage;
