import React, { useRef, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import {
  CheckIcon,
  CropIcon,
  Cross1Icon,
  ImageIcon,
} from "@radix-ui/react-icons";
import { MessageForm } from "@/app/(user)/(non_auth)/chat/[chatId]/_components/CaptionMessageForm";
import { compressAccurately } from "image-conversion";
import { Button } from "../ui/button";
import { SunIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/utils/firebase";
import { sendAdminMessage } from "@/lib/utils/adminActions/chats";
import { sendUserMessage } from "@/lib/utils/actions/userChat";
import { v4 } from "uuid";
import { useMessagesStore } from "@/lib/utils/store/userConversation";
import { adminCurrConversationStore } from "@/lib/utils/store/adminConversation";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { postToast } from "../postToast";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { cn } from "@/lib/utils";

type Props = {
  openS: boolean;
  setOpenS: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToBottom: React.RefObject<HTMLDivElement>;
  owns: string;
};

type FileObjects = {
  file: File;
  url: string;
}[];

const uc = Cookies.get("user");
const user = JSON.parse(uc || "{}");

const CropperJs = ({ openS, setOpenS, scrollToBottom, owns }: Props) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const cropperRef = useRef<Cropper | null>(null);
  const [edit, setEdit] = useState(false);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMultipleFile, setIsMultipleFile] = useState(false);
  const [multipleFiles, setMultipleFiles] = useState<FileObjects>([]);

  const { updateConversation, conversation } = useMessagesStore();
  const adminConversationStore = adminCurrConversationStore();
  const chatId = usePathname().split("/")[usePathname().split("/").length - 1];

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    const file = event.target.files?.[0];

    if (!files || files.length === 0) return;

    if (files.length > 1) {
      const filesArray = Array.from(files);

      const fileObjects = filesArray.map((file) => {
        const url = URL.createObjectURL(file);
        return { file, url };
      });

      setMultipleFiles(fileObjects);
      setIsMultipleFile(true);
    } else {
      if (file) {
        const compressedFile = await compressAccurately(file, {
          accuracy: 0.92,
          size: 1000,
        });

        const reader = new FileReader();

        reader.onload = () => {
          setImageUrl(reader.result as string);
        };

        reader.readAsDataURL(compressedFile);
      }
    }
  };

  const handleEdit = () => {
    if (cropperRef.current) {
      const url = cropperRef.current
        .getCroppedCanvas({ maxWidth: 4096, height: 4096 })
        .toDataURL();

      setImageUrl(url);
      cropperRef.current.destroy();
      setEdit(false);
    }
  };

  const clearEdit = () => {
    if (cropperRef.current) {
      setImageUrl("");
      setEdit(false);
      cropperRef.current.destroy();
    }
  };

  const uploadMultipleFiles = async () => {
    scrollToBottom.current?.lastElementChild?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });

    if (multipleFiles.length < 0) return;

    try {
      const recipient =
        owns === "admin"
          ? adminConversationStore.conversation?.user
          : conversation?.user;

      postToast("", {
        description: (
          <div className="flex align-middle place-items-center justify-start gap-3">
            <SunIcon width={18} className="animate-spin" />
            <span>Uploading</span>
          </div>
        ),
        duration: 100000,
        id: "uploadMultiple",
        dismissible: false,
        position: "top-right",
      });

      setEdit(false);
      setOpenS(false);

      for (const file of multipleFiles) {
        const IMAGE_NAME = v4();
        const path = `/chatImages/${chatId}/${user?.uid}_${IMAGE_NAME}`;
        const storageRef = ref(storage, path);
        const uploadTask = await uploadBytes(storageRef, file.file);

        const url = await getDownloadURL(uploadTask.ref);

        if (owns === "admin") {
          await sendAdminMessage(
            {
              timeStamp: new Date(),
            },
            chatId,
            recipient as {
              username: string;
              uid: string;
              email: string;
              photoUrl: string;
            },
            undefined,
            {
              caption,
              url,
              metadata: {
                media_name: url,
                media_type: "",
                media_size: 0,
              },
            },
            true
          );
        } else {
          await sendUserMessage(
            {
              timeStamp: new Date(),
            },
            chatId,
            undefined,
            {
              caption,
              url,
              metadata: {
                media_name: url,
                media_type: "",
                media_size: 0,
              },
            },
            true
          );

          console.log("MESSAGE SENT");
        }

        scrollToBottom.current?.lastElementChild?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }

      setMultipleFiles([]);
      setImageUrl("");
      setIsMultipleFile(false);
      postToast("✔️ Done", {
        duration: 2000,
        position: "top-right",
      });
    } catch (error) {
      console.log("Error uploading files", error);
    } finally {
      toast.dismiss("uploadMultiple");
      scrollToBottom.current?.lastElementChild?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    const filesArray = Array.from(files);
    const fileObjects = filesArray.map((file) => {
      const url = URL.createObjectURL(file);
      return { file, url };
    });

    if (fileObjects.length > 0) {
      setMultipleFiles((prev) => [...prev, ...fileObjects]);
    }
  };

  console.log("MULTIPLE", multipleFiles);
  return (
    <Dialog
      open={openS}
      onOpenChange={(e) => {
        if (e === false) {
          setImageUrl("");
          setEdit(false);
          cropperRef.current?.destroy();
        }
        setOpenS(e);
      }}
    >
      <DialogContent>
        <div className="h-auto max-h-screen">
          {imageUrl && (
            <div className="flex align-middle place-items-center justify-start gap-1 pb-2">
              {!edit && (
                <div className="grid grid-flow-col gap-1.5 place-items-center">
                  <Button
                    onClick={() => setEdit(true)}
                    className={`edit`}
                    variant={"ghost"}
                    size={"icon"}
                  >
                    <CropIcon width={24} />
                  </Button>
                  <Button
                    onClick={() => {
                      clearEdit();
                      setImageUrl("");
                      setMultipleFiles([]);
                      setIsMultipleFile(false);
                    }}
                    variant={"ghost"}
                    size={"icon"}
                  >
                    <TrashIcon width={18} />
                  </Button>
                </div>
              )}

              {edit && (
                <div className="grid grid-flow-col gap-2 place-items-center">
                  <Button
                    onClick={() => {
                      handleEdit();
                    }}
                    className="bg-green-400/20 hover:bg-green-400/30 dark:bg-green-400/60 dark:hover:bg-green-400/80"
                    variant={"ghost"}
                    size={"icon"}
                  >
                    <CheckIcon width={24} />
                  </Button>
                  <Button
                    onClick={() => {
                      if (cropperRef.current) {
                        cropperRef.current.destroy();
                      }

                      setEdit(false);
                    }}
                    className="bg-red-400/20 hover:bg-red-400/30  dark:bg-red-400/70 dark:hover:bg-red-400/80"
                    variant={"ghost"}
                    size={"icon"}
                  >
                    <Cross1Icon width={24} />
                  </Button>
                </div>
              )}
            </div>
          )}

          {isMultipleFile && multipleFiles.length > 0 && (
            <div>
              <Label
                className="px-5 py-3 rounded-lg outline-2 hover:outline-pink-400/20 align-middle place-items-center flex gap-1 w-fit hover:bg-pink-500/20"
                htmlFor="sjdjshd"
              >
                <ImageIcon /> Add
              </Label>
              <input
                id="sjdjshd"
                className="hidden"
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddFiles}
              />
              <Carousel>
                <CarouselContent>
                  {multipleFiles.map(({ file, url }, idx) => (
                    <CarouselItem
                      key={file.name}
                      className="place-items-center relative p-1"
                    >
                      {multipleFiles.length > 1 && (
                        <Button
                          onClick={() => {
                            const newMultipleFiles = [...multipleFiles];
                            newMultipleFiles.splice(idx, 1);
                            setMultipleFiles(newMultipleFiles);
                          }}
                          variant={"ghost"}
                          className="flex gap-1 text-red-500 mb-1.5 absolute top-8 right-2 bg-white/80"
                        >
                          <TrashIcon width={18} /> Remove
                        </Button>
                      )}
                      <Image
                        src={url}
                        alt={file.name}
                        className="object-contain h-[75dvh] w-full rounded-xl"
                        width={300}
                        height={300}
                      />

                      <span className="text-md font-bold bg-white/50 dark:bg-white/10 dark:text-white p-0.5 rounded-lg w-1/6 backdrop-blur-sm text-center absolute bottom-4 left-1/2 -translate-x-1/2 text-black">
                        {idx + 1}
                      </span>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}
          {!isMultipleFile && !imageUrl && (
            <div className="h-full w-full grid place-items-center">
              <input
                id="heiuv9823"
                className="hidden"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
              <Label
                htmlFor="heiuv9823"
                className="p-16 w-full h-full border-2 border-dashed border-purple-400 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-100/10 duration-300 hover:text-purple-900 dark:hover:text-purple-300 flex-col flex align-middle place-items-center justify-center gap-0.5"
              >
                <span className="flex align-middle place-items-center justify-center gap-2 text-lg">
                  <ImageIcon /> Upload
                </span>
                <span className="italic text-xs text-neutral-400/70">
                  1 or more files.
                </span>{" "}
              </Label>
            </div>
          )}
          {imageUrl && edit ? (
            <div className="max-h-[400px]">
              <Image
                src={imageUrl}
                alt="Cropper Preview"
                className="w-full h-full"
                layout="responsive"
                width={100}
                height={100}
                ref={(node) => {
                  if (node) {
                    cropperRef.current = new Cropper(node, {
                      autoCrop: false,
                      zoomable: false,
                      movable: false,
                      guides: false,
                      highlight: false,
                      background: false,
                    });
                  }
                }}
              />
            </div>
          ) : (
            imageUrl && (
              <div className="md:max-h-[400px] max-h-screen h-fit grid gap-2 place-items-center align-middle">
                <Image
                  src={imageUrl}
                  blurDataURL={imageUrl}
                  alt="Cropper Preview"
                  className="w-fit md:h-[350px]"
                  width={100}
                  height={100}
                  onLoad={(e) => {}}
                />
                <MessageForm
                  imageUrl={imageUrl}
                  setOpenS={setOpenS}
                  edit={edit}
                  caption={caption}
                  setCaption={setCaption}
                  setLoading={setLoading}
                  loading={false}
                  owns={owns}
                  setImageUrl={setImageUrl}
                  setEdit={setEdit}
                  scrollToBottom={scrollToBottom}
                  cropperRef={cropperRef}
                />
              </div>
            )
          )}
          {isMultipleFile && multipleFiles.length > 0 && (
            <div className="flex align-middle place-items-center justify-between gap-2 mt-1.5">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full"
                    title="Delete all pictures"
                  >
                    Cancel
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    All pictures will be deleted.
                  </AlertDialogDescription>

                  <AlertDialogCancel>Close</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setMultipleFiles([]);
                      setImageUrl("");
                      setIsMultipleFile(false);
                    }}
                  >
                    Delete all
                  </AlertDialogAction>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                className="w-full flex align-middle justify-center gap-1"
                onClick={() => {
                  uploadMultipleFiles();
                }}
              >
                Send{" "}
                <div className="text-[12px] bg-white/30 rounded-full w-5 h-5 grid place-items-center align-middle">
                  <span>{multipleFiles.length}</span>
                </div>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CropperJs;
