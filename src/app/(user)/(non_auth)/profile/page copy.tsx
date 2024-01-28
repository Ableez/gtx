"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, db, storage } from "@/lib/utils/firebase";
import { parseCookie } from "@/lib/utils/parseCookie";
import {
  CheckBadgeIcon,
  EllipsisVerticalIcon,
  PhotoIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Image from "next/image";
import React, {
  BaseSyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import Cookie from "js-cookie";
import Loader from "@/components/Loader";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type Props = {};

const UserProfile = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const uid = Cookie.get("uid");
  const cachedUser = parseCookie("user");
  const [updatedUser, setUpdatedUser] = useState({
    username: "",
    email: "",
  });
  const [userData, setUserData] = useState<FireStoreUser>();
  const [img, setImg] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: "",
    accountName: "",
    bankName: "",
  });
  const [addAcct, setAddAcct] = useState(false);
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    const ref = doc(db, "Users", uid);
    const data = await getDoc(ref);
    setUserData(data?.data() as FireStoreUser);
    const fetched = data.data() as FireStoreUser;

    setUpdatedUser({
      username: fetched.username,
      email: fetched.email,
    });

    setLoading(false);
    Cookies.remove("user");
    Cookies.set(
      "user",
      JSON.stringify({
        uid: fetched?.id,
        displayName: fetched?.username,
        email: fetched?.email,
        photoURL: fetched?.imageUrl,
        emailVerified: auth.currentUser?.emailVerified,
      }),
      {
        expires: 7 * 24,
      }
    );

    router.refresh();
  }, [uid, router]);

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="grid place-items-center p-32">
        <Loader />
      </div>
    );
  }

  const updateUserImage = async (url: string) => {
    const ref = doc(db, "Users", userData?.id);
    await updateProfile(auth?.currentUser, { photoURL: url });
    await updateDoc(ref, { imageUrl: url });
    router.refresh();
  };

  const uploadFile = async (e: BaseSyntheticEvent) => {
    const storageRef = ref(storage, `/profileImages/${e.target.files[0].name}`);
    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        setError("Error uploading file");
        console.log("Error uploading file", error);
      },
      () => {
        const process = async () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            updateUserImage(url);
            fetchUserData();
            setUploadProgress(0);
          });
        };

        process();
      }
    );
  };

  const updateUsername = async () => {
    try {
      const ref = doc(db, "Users", userData?.id);
      await updateProfile(auth?.currentUser, {
        displayName: updatedUser.username,
      });
      await updateDoc(ref, { username: updatedUser.username });
      fetchUserData();

      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const savePaymentDetails = async () => {
    try {
      const docRef = doc(db, "Users", userData?.id);

      console.log(accountDetails);
      if (
        accountDetails.accountNumber === "" ||
        accountDetails.accountName === "" ||
        accountDetails.bankName === ""
      ) {
        console.log("not saved!!");
        return;
      }
      // Update the messages array and lastMessage fields
      // check if the account number already exists in the firestore data base
      const q = query(
        collection(db, "Users"),
        where("payment.accountNumber", "==", accountDetails.accountNumber)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length > 0) {
        setError("Account number already exists");
        console.log(querySnapshot.docs);
        return;
      }

      await updateDoc(docRef, {
        savedPayments: true,
        payment: arrayUnion({
          accountName: accountDetails.accountName,
          accountNumber: accountDetails.accountNumber,
          bank: accountDetails.bankName,
        }),
      });

      setAccountDetails({
        accountNumber: "",
        accountName: "",
        bankName: "",
      });

      fetchUserData();

      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pb-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="container py-8 border-b"
      >
        <div className="space-y-4">
          <div className="pb-12">
            <div className="col-span-full">
              <div className="mt-2 grid place-items-center justify-center items-center gap-x-3">
                {userData?.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    width={140}
                    height={140}
                    alt={"userData.username"}
                    src={userData?.imageUrl}
                    className="aspect-square rounded-full mb-4 object-cover shadow-md border-4 border-white"
                  />
                ) : (
                  <UserCircleIcon
                    className="h-32 w-32 text-neutral-300"
                    aria-hidden="true"
                  />
                )}

                {uploadProgress > 0 ? (
                  <div className="flex align-middle place-items-center gap-2 text-[12px] font-bold text-neutral-400 italic">
                    <h4>{Math.floor(uploadProgress)}%</h4>
                    <div className="bg-neutral-200 w-20 rounded-full">
                      <div
                        className={`w-[${uploadProgress}%] rounded-full h-[2px] bg-green-500`}
                      />
                    </div>
                  </div>
                ) : (
                  <Label
                    htmlFor="profileImage"
                    className="rounded-md bg-white dark:bg-neutral-900 dark:ring-neutral-700 dark:text-white cursor-pointer px-2.5 py-1.5 text-sm font-semibold text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50"
                  >
                    Change
                  </Label>
                )}

                <input
                  onChange={(e) => uploadFile(e)}
                  className="hidden"
                  id="profileImage"
                  type="file"
                />
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <Label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-500"
                >
                  Username
                </Label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm">
                    <Input
                      type="text"
                      name="username"
                      id="username"
                      autoComplete="username"
                      className="capitalize py-3"
                      defaultValue={userData?.username}
                      placeholder={userData?.username || "Praise"}
                      onChange={(e) => {
                        setUpdatedUser((prev) => {
                          return {
                            ...prev,
                            username: e.target.value,
                          };
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-4">
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-500"
                >
                  Email
                </Label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm">
                    <h4 className="w-full rounded-lg px-3 py-2 shadow-sm border text-black dark:text-white flex align-middle place-items-center justify-between">
                      {userData?.email || "praise@greatexc.com"}
                      {auth.currentUser?.emailVerified ? (
                        <Button
                          variant={"ghost"}
                          className="bg-green-200 border border-green-500 text-xs p-1.5"
                        >
                          Verified
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            sendEmailVerification(auth?.currentUser);
                            alert("Verification sent");
                          }}
                          variant={"ghost"}
                          className="bg-green-500 text-green-100 border border-green-600 hover:bg-green-500 hover:text-white hover:shadow-inner text-xs p-1.5"
                        >
                          Verify
                        </Button>
                      )}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex align-middle justify-end gap-4">
            {userData?.username.trim() !== updatedUser.username.trim() && (
              <Button className="w-1/2 hover:text-red-950" variant={"outline"}>
                Cancel
              </Button>
            )}
            <Button
              onClick={() => {
                updateUsername();
              }}
              className="w-1/2"
              disabled={
                // if userdata name === update name : true
                // if userdata email === updated email : true
                // else if all or any of these are not the same : false
                userData?.username.trim() == updatedUser.username.trim()
                  ? true
                  : false
              }
            >
              Save
            </Button>
          </div>
        </div>
      </form>
      <div className="container py-6">
        <h4 className="font-semibold text-sm pb-2">Saved Payments</h4>
        <p className="text-xs text-neutral-400">
          All your saved payment methods.
        </p>
      </div>
      <div className="mx-4 mb-4 bg-white dark:bg-neutral-800 rounded-xl py-4">
        <div className="grid gap-4">
          <div className="grid align-middle place-items-center gap-3 max-h-[350px] overflow-y-auto overscroll-contain p-2">
            {userData?.payment?.map((detail, idx) => {
              return (
                <div
                  key={idx}
                  className="flex align-middle place-items-center justify-between w-full cursor-pointer border-2 border-transparent hover:border-pink-200 dark:hover:border-purple-600/25 dark:text-white hover:rounded-md hover:bg-neutral-50 duration-300 relative  dark:hover:bg-neutral-800 border-b-neutral-50 dark:border-b-neutral-700"
                >
                  <div
                    className={`p-2 pl-4 cursor-pointer rounded-md  duration-300 relative w-full`}
                  >
                    <h4 className="text-xs text-neutral-800 font-medium dark:text-white">
                      {detail?.accountNumber}
                    </h4>
                    <div className="flex align-middle place-items-center gap-2 pt-1 text-xs text-neutral-400">
                      <span>{detail?.accountName}</span>
                      <span>·</span>
                      <span>{detail?.bank}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-4 focus-visible:outline-none">
                      <EllipsisVerticalIcon width={18} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-0 mr-4">
                      <DropdownMenuItem className="bg-red-300 dark:bg-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={addAcct}>
        <DialogTrigger className="ml-4">
          <Button onClick={() => setAddAcct(true)}>Add new</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bank Details</DialogTitle>
            <DialogDescription>Add new account detail.</DialogDescription>
            <DialogClose
              onClick={() => setAddAcct(false)}
              className="p-2.5 bg-white border rounded-md w-fit absolute top-2 right-2 z-50"
            >
              <XMarkIcon width={16} />
            </DialogClose>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                savePaymentDetails();
              }}
            >
              <div className="pb-8 text-left">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <Label
                      htmlFor="accountNumber"
                      className="block text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-500"
                    >
                      Account Number
                    </Label>
                    <div className="mt-2">
                      <Input
                        onChange={(e: BaseSyntheticEvent) => {
                          setAccountDetails((prev) => {
                            return {
                              ...prev,
                              accountNumber: e.target.value,
                            };
                          });
                        }}
                        type="number"
                        name="accountNumber"
                        id="accountNumber"
                        placeholder="0123456789"
                        className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-pink-300 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <Label
                      htmlFor="accountName"
                      className="block text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-500"
                    >
                      Full Name
                    </Label>
                    <div className="mt-2">
                      <Input
                        onChange={(e: BaseSyntheticEvent) => {
                          setAccountDetails((prev) => {
                            return {
                              ...prev,
                              accountName: e.target.value,
                            };
                          });
                        }}
                        type="text"
                        name="accountName"
                        id="accountName"
                        placeholder="Account Name"
                        className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-pink-300 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <Label
                      htmlFor="bankName"
                      className="block text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-500"
                    >
                      Bank Name
                    </Label>
                    <div className="mt-2">
                      <Input
                        onChange={(e: BaseSyntheticEvent) => {
                          setAccountDetails((prev) => {
                            return {
                              ...prev,
                              bankName: e.target.value,
                            };
                          });
                        }}
                        id="bankName"
                        name="bankName"
                        type="bankName"
                        autoComplete="bankName"
                        placeholder="XYZ Bank"
                        className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-pink-300 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        setAddAcct(false);
                      }}
                      className="w-full"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfile;
