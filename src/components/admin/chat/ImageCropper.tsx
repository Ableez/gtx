import Image from "next/image";
import React, { useRef, useState } from "react";
import ReactCrop, {
  Crop,
  PercentCrop,
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import setCanvasPreview from "./canvasPreview";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@radix-ui/react-icons";

type Props = {
  setImgSrc: React.Dispatch<React.SetStateAction<string>>;
  imgSrc: string;
  ASPECT_RATIO: number | undefined;
  MIN_DIMENSION: number;
  setImage: React.Dispatch<React.SetStateAction<File | null | undefined>>;
  image: File | null | undefined;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  edit: boolean;
};

function dataURLToBlob(dataURL: string): Blob {
  const parts = dataURL.split(",");
  const contentType = parts[0].split(":")[1].split(";")[0];
  const base64Data = parts[1];
  const byteString = atob(base64Data);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: contentType });
}

const ImageCropper = ({
  setImgSrc,
  imgSrc,
  ASPECT_RATIO,
  MIN_DIMENSION,
  setImage,
  image,
  setEdit,
  edit,
}: Props) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [crop, setCrop] = useState<Crop>();

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      1 / 1,
      width,
      height
    );

    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const finishEdit = () => {
    if (imgRef.current && previewCanvasRef.current) {
      setCanvasPreview(
        imgRef.current, // HTMLImageElement
        previewCanvasRef.current, // HTMLCanvasElement
        convertToPixelCrop(
          crop as Crop,
          imgRef.current.width,
          imgRef.current.height
        )
      );

      const dataUrl = previewCanvasRef.current.toDataURL();
      const blob = dataURLToBlob(dataUrl);
      const url = URL.createObjectURL(blob);
      const toFile = new File([blob], image?.name as string, {
        type: image?.type,
        lastModified: new Date().getTime(),
      });
      setImgSrc(url);
      setImage(toFile);
      setEdit(false);
    }
  };

  return (
    <div className=" w-fit mx-auto">
      <div className="relative w-fit ">
        <div className="absolute top-2 right-2 z-50 bg-white bg-opacity-50 backdrop-blur-md rounded-sm">
          {edit ? (
            <div className="flex align-middle place-items-center justify-between">
              <button
                title="Cancel edit"
                className="p-1.5 rounded-l-sm hover:bg-white"
                onClick={() => setEdit(false)}
              >
                <XMarkIcon width={16} />
              </button>
              <button
                title="Finish edit"
                className="p-1.5 rounded-r-sm hover:bg-white"
                onClick={() => finishEdit()}
              >
                <CheckIcon width={16} />
              </button>
            </div>
          ) : (
            <button
              title="Edit image"
              className="p-1.5 rounded-sm hover:bg-white"
              onClick={() => setEdit(true)}
            >
              <PencilIcon width={16} />
            </button>
          )}
        </div>
        <div className="w-fit ">
          {edit ? (
            <ReactCrop
              crop={crop}
              onChange={(pixelCrop, percentCrop) => {
                setCrop(pixelCrop);
              }}
              aspect={ASPECT_RATIO}
              keepSelection
              minWidth={MIN_DIMENSION}
              minHeight={MIN_DIMENSION}
              className="w-full m-0 p-0 max-h-[50vh]"
            >
              <Image
                ref={imgRef}
                src={imgSrc}
                width={500}
                height={500}
                className="w-full max-h-[50vh]"
                alt="Upload"
                onLoad={onImageLoad}
              />
            </ReactCrop>
          ) : (
            <Image
              src={imgSrc}
              alt=""
              width={200}
              height={200}
              className="w-full max-h-[50vh]"
            />
          )}
        </div>
      </div>

      {crop && <canvas ref={previewCanvasRef} className="mt-4 hidden" />}
    </div>
  );
};

export default ImageCropper;
