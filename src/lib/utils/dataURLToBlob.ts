export function dataURLToBlob(dataURL: string): Blob {
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
