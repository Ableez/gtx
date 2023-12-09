"use client";
import React, { useEffect, useState } from "react";
import * as dotenv from "dotenv";
import { collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/utils/firebase";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  updateProfile,
} from "firebase/auth";
import Image from "next/image";

dotenv.config({ path: ".env" });

type UserData = {
  email: string;
  username: string;
  id: string;
  imageUrl: string | null;
};

type UserDocument = {
  id: string;
  data: UserData;
};

type Props = {};

const AdminViewUsers = (props: Props) => {
  const [users, setUsers] = useState<UserDocument[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, "Users"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const userData = querySnapshot.docs
            .map((doc) => {
              if (doc.exists()) {
                return { id: doc.id, data: doc.data() } as UserDocument;
              } else {
                console.log("document does not exist");
                return null;
              }
            })
            .filter(Boolean) as UserDocument[];

          setUsers(userData);
        });

        return () => unsubscribe(); // Cleanup the subscription when the component unmounts
      } catch (error) {
        console.error(error);
      }
    };

    fetch();
  }, []);

  const renderUser = users.map((user, idx) => {
    return (
      <Dialog key={idx}>
        <DialogTrigger asChild>
          <div className="grid grid-flow-col grid-cols-3 align-middle justify-between hover: gap-4">
            <Image
              src={"/logoplace.svg"}
              width={30}
              height={30}
              alt="User profile"
              className="col-span-1"
            />
            <h4 className="col-span-7">{user.data.username}</h4>
            <p className="hidden sm:flex col-span-4">{user.data.email}</p>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[340px]">
          <DialogHeader>
            <DialogTitle>Information</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <h4>{user.data.username}</h4>
            <p>{user.data.email}</p>
          </div>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  });

  return (
    <div className="container py-2">
      <div>
        <h4 className="font-bold">Users</h4>

        <div className="grid grid-flow-row gap-3 border">{renderUser}</div>
      </div>
    </div>
  );
};

export default AdminViewUsers;
