import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "./firebaseClient";

class FirebaseUploadAdapter {
    loader: any;

    constructor(loader: any) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file.then((file: any) => new Promise(async (resolve, reject) => {
            try {
                const imageRef = ref(storage, `post/uploads/${file.name}`);
                const base64 = await fileToBase64(file)
                await uploadString(imageRef, base64 as string, "data_url");
                const downloadURL = await getDownloadURL(imageRef);
                resolve({ default: downloadURL });
            } catch (error) {
                console.error('Upload failed:', error);
                reject(error);
            }
        }));
    }

    abort() {
        // Not implemented for Firebase Storage uploads
    }
}

function fileToBase64(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(event) {
            resolve(event.target?.result);
        };

        reader.onerror = function(error) {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
}

export function FirebaseUploadAdapterPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
        return new FirebaseUploadAdapter(loader);
    };
}