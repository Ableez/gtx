import React, { useRef, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";
import Image from "next/image";
import { Dialog, DialogContent } from "../ui/dialog";
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
import { TrashIcon } from "@heroicons/react/24/outline";

type Props = {
  openS: boolean;
  setOpenS: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToBottom: React.RefObject<HTMLDivElement>;
  owns: string;
};

const CropperJs = ({ openS, setOpenS, scrollToBottom, owns }: Props) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const cropperRef = useRef<Cropper | null>(null);
  const [edit, setEdit] = useState(false);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      const compressedFile = await compressAccurately(file, {
        accuracy: 0.92,
        size: 1000,
      });

      console.log("COMPRESSED FILE SIZE", compressedFile.size / 1024);

      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
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

          {!imageUrl && (
            <div className="h-full w-full grid place-items-center">
              <input
                id="heiuv9823"
                className="hidden"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Label
                htmlFor="heiuv9823"
                className="p-16 w-full h-full border-2 border-dashed border-purple-400 rounded-xl flex align-middle place-items-center justify-center gap-2 hover:bg-purple-100 dark:hover:bg-purple-100/10 duration-300 hover:text-purple-900 dark:hover:text-purple-300"
              >
                <ImageIcon /> Upload
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CropperJs;
