import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const storage = getStorage();

export const uploadFilesToStorage = async (files, ticketId) => {
  try {
    const uploadedURLs = [];

    for (const file of files) {
      const uniqueName = `${ticketId}/${uuidv4()}-${file.name}`;
      const fileRef = ref(storage, uniqueName);

      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      uploadedURLs.push(url);
    }

    return uploadedURLs;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw new Error("File upload failed");
  }
};
