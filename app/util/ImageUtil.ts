export async function getImageBlobFromURL(url: string): Promise<Blob> {
    //Fetch image data from url 
    const imageData = await fetch(url);
    //Create blob of image data
    const imageBlob = await imageData.blob();
    return imageBlob;
 }

 export async function fetchImage(url: string): Promise<string> {
    const imageData = await fetch(url);
    const imageBlob = await imageData.blob();
    const objectURL = URL.createObjectURL(imageBlob);
    return objectURL;
 }
 export async function blobToBase64(blob: Blob): Promise<string> {
    const buffer = await blob.arrayBuffer();
    return Buffer.from(buffer).toString('base64');
  }
  