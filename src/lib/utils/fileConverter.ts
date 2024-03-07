export const fileToArrayBuffer = async (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error("Error converting file to ArrayBuffer"));
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

export const arrayBufferToFile = async (
  arrayBuffer: ArrayBuffer,
  fileName: string,
  fileType: string
) => {
  const blob = new Blob([arrayBuffer], { type: fileType });
  return new File([blob], fileName);
};

export const fileToObject = async (
  file: File
): Promise<{ name: string; type: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        const plainObject = {
          name: file.name,
          type: file.type,
          data: reader.result,
        };

        resolve(plainObject);
      } else {
        reject(new Error("Failed to convert File to plain object"));
      }
    };

    reader.readAsDataURL(file);
  });
};

export const objectToFile = (obj: {
  name: string;
  type: string;
  data: string;
}) => {
  const binaryString = atob(obj.data.split(",")[1]);
  const arrayBuffer = new ArrayBuffer(binaryString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  const blob = new Blob([uint8Array], { type: obj.type });
  const file = new File([blob], obj.name, { type: obj.type });
  // const file = Buffer.from(obj.data.split(",")[1], "base64");
  return file;
};
