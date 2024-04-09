import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "./firebaseClient";
import { FirestoreError } from "firebase/firestore";

class FirebaseUploadAdapter {
    loader: any;

    constructor(loader: any) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file.then((file: any) => new Promise((resolve, reject) => {
                uploadToFirestore(file).then(downloadURL => {
                    resolve({
                        default: downloadURL
                    });
                }).catch(err => {
                    reject(err);
                })
        }));
    }

    abort() {
        // Not implemented for Firebase Storage uploads
    }
}

async function uploadToFirestore(file: File) {
    try {
        const imageRef = ref(storage, `post/uploads/${file.name}`);
        const base64 = await fileToBase64(file)
        await uploadString(imageRef, base64 as string, "data_url");
        const downloadURL = await getDownloadURL(imageRef);
        return downloadURL
    } catch (error) {
        if(error instanceof FirestoreError) {
            console.error(error.message)
            throw new Error(error.message)
          }
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