import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { sendAdminMessage } from "@/lib/utils/adminActions/chats";
import { storage } from "@/lib/utils/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import React, { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import { Conversation } from "../../../../chat";
import { postToast } from "@/components/postToast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ImageCropper from "./ImageCropper";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Loading from "@/app/loading";

type Props = {
  id: string;
  openEdit: boolean;
  setOpenEdit: React.Dispatch<React.SetStateAction<boolean>>;
  message: Conversation;
  scrollToBottom: React.RefObject<HTMLDivElement>;
};

const ASPECT_RATIO = undefined;
const MIN_DIMENSION = 100;

const CropImage = ({
  openEdit,
  setOpenEdit,
  id,
  message,
  scrollToBottom,
}: Props) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [caption, setCaption] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>();
  const [imgSrc, setImgSrc] = useState("");
  const [fakeUrl, setFakeUrl] = useState("");
  const [edit, setEdit] = useState(false);

  const sendImageAction = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      formData.append("id", id);
      setLoading(true);
      if (image && image.size > 15000000) {
        postToast("Warning!", {
          description: "Image size is too big and might take a while to load.",
        });
      }

      if (image) {
        setProgress(1);
        const storageRef = ref(
          storage,
          `/cardImages/www.greatexchange.co---${id}---${image.name}`
        );

        setProgress(1);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snap) => {
            const progress = (snap.bytesTransferred / snap.totalBytes) * 100;
            setProgress(progress);
          },
          (err) => {
            postToast("Error", { description: err.message });
          },
          async () => {
            const mediaurl = await getDownloadURL(uploadTask.snapshot.ref);

            const sentMessage = await sendAdminMessage(
              { timeStamp: new Date() },
              id,
              message?.user as {
                username: string;
                uid: string;
                email: string;
                photoUrl: string;
              },
              formData,
              {
                caption: caption,
                url: mediaurl,
                metadata: {
                  media_name: uploadTask.snapshot.metadata.name,
                  media_size: uploadTask.snapshot.metadata.size,
                  media_type: uploadTask.snapshot.metadata.contentType,
                },
              },
              true
            );

            if (!sentMessage?.success) {
              postToast("Error", { description: sentMessage?.message });
              setLoading(false);
              return;
            }

            if (sentMessage?.success) {
              setOpenEdit(false);
              setProgress(0);
              setCaption("");
              setError("");
              setLoading(false);
              scrollToBottom.current?.scrollIntoView({ behavior: "smooth" });
              setImage(null);
              setImgSrc("");
              postToast("Done", { description: "Image sent!" });
            }
          }
        );
      }
    } catch (error) {
      postToast("Error", {
        description: "An error occured while sending image.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageUrl = reader.result?.toString() || "";
      setImgSrc(imageUrl);
    });
    reader.readAsDataURL(file);
  };

  return (
    <>
      {loading && <Loading />}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="w-[100vw] max-w-md rounded-2xl">
          <DialogHeader>
            {imgSrc && (
              <button
                disabled={loading}
                className="absolute left-2 md:left-1/2 md:-translate-x-1/2 bg-white py-1 hover:bg-neutral-200 bg-opacity-30 backdrop-blur-lg rounded-md border px-3"
                onClick={() => {
                  setImgSrc("");
                  setImage(null);
                }}
              >
                Clear
              </button>
            )}

            <DialogTitle className="text-lg font-bold">Edit image</DialogTitle>
          </DialogHeader>

          {imgSrc ? (
            <ImageCropper
              edit={edit}
              setEdit={setEdit}
              setImage={setImage}
              image={image}
              ASPECT_RATIO={ASPECT_RATIO}
              MIN_DIMENSION={MIN_DIMENSION}
              imgSrc={imgSrc}
              setImgSrc={setImgSrc}
            />
          ) : (
            <div className="p-2 grid place-items-center">
              <Label
                htmlFor="gallery"
                className="p-8 rounded-xl border-2 border-dashed cursor-pointer hover:bg-purple-100 hover:border-purple-300 duration-300"
              >
                Select an Image
              </Label>
              <Input
                className="hidden"
                id="gallery"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setFakeUrl(url);
                  }
                  onSelectFile(e);
                }}
              />
            </div>
          )}

          {imgSrc && !edit && (
            <div>
              <div className="mb-3 w-[50%] mx-auto flex align-middle place-items-center gap-2">
                {progress > 0 && <Progress value={progress} />}
              </div>
              <div
                className={`text-red-500 text-xs text-center mb-1 transition-all duration-100 font-bold dark:bg-neutral-900 rounded-xl overflow-clip text-clip absolute  px-2 top-10 left-1/2 -translate-x-1/2 delay-100 opacity-0 ${
                  error ? "h-fit w-fit p-0.5 opacity-80" : "h-0 w-0 p-0"
                }`}
              >
                {error}
              </div>
              <form
                onSubmit={sendImageAction}
                className="grid grid-flow-col align-middle place-items-center justify-between bg-neutral-200 dark:bg-neutral-800 rounded-lg max-w-md mx-auto"
              >
                <input
                  id="message"
                  name="message"
                  disabled={loading}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  autoCorrect="true"
                  autoComplete="off"
                  className={`font-normal transition-all duration-300 resiL-none leading-4 text-xs md:text-sm antialiased focus:outline-none col-span-10 w-full h-fit p-3 bg-neutral-200 dark:bg-neutral-800 outline-none rounded-l-lg disabled:cursor-not-allowed disabled:bg-opacity-50`}
                  placeholder="Caption (optional)"
                  data-gramm="false"
                  data-gramm_editor="false"
                  data-enable-grammarly="false"
                />
                <button
                  title="Send Message"
                  disabled={loading || edit}
                  type="submit"
                  className="focus:outline-none col-span-2 border-secondary duration-300 w-full h-full py-1 grid place-items-center align-middle bg-secondary text-white rounded-r-lg p-2 px-4 disabled:cursor-not-allowed disabled:bg-opacity-50"
                >
                  <PaperAirplaneIcon width={25} />
                </button>
              </form>
            </div>
          )}
          {/* Fake image element */}
          <Image
            src={fakeUrl}
            alt=""
            width={0}
            height={0}
            className="hidden"
            onLoad={(e) => {
              const { naturalWidth, naturalHeight } = e.currentTarget;
              if (
                imgSrc &&
                (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION)
              ) {
                postToast("Image", {
                  description: "Image must be at least 100 x 100 pixels.",
                });
                setFakeUrl("");
                setImgSrc("");
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CropImage;
