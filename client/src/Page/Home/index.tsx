import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { analytics, storage } from "../../firebase/FirebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { logEvent } from "firebase/analytics";
import { TailSpin } from "react-loading-icons";
import { User } from "firebase/auth";

type userDataProps = {
  userData: User;
  setUserData: Dispatch<SetStateAction<User | null>>;
};

function Home({ userData, setUserData }: userDataProps) {
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { uid } = userData;

  console.log(imageUrl);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileImage(selectedFile || null);
  };

  const uploadImage = () => {
    if (fileImage) {
      setLoadingImage(true);
      const storageRef = ref(storage, uid);
      uploadBytes(storageRef, fileImage)
        .then(() => {
          logEvent(analytics, "uploaded_Image_To_Firebase", {
            fileImage: fileImage,
            fileImageName: fileImage.name,
          });
          console.log("Image uploaded to Firebase Storage");
          setFileImage(null);
          setLoadingImage(false);

          // Update the imageUrl state with the newly uploaded image URL
          getDownloadURL(storageRef)
            .then((url) => {
              setImageUrl(url);
            })
            .catch((error) => {
              console.log("Error getting download URL:", error);
            });
        })
        .catch((err) => {
          logEvent(analytics, "Error_uploaded_Image_To_Firebase", {
            fileImage: fileImage,
            fileImageName: fileImage.name,
            error_message: err.message,
          });
          console.log(err);
        });
    }
  };

  useEffect(() => {
    const storageRef = ref(storage, uid);

    getDownloadURL(storageRef)
      .then((url) => {
        setImageUrl(url);
      })
      .catch((error) => {
        console.log("Error getting download URL:", error);
      });
  }, [uid]);

  return (
    <div className="container mx-auto py-8">
      <div className="">
        <div className="flex mx-4 max-w-[1400px] py-16 justify-between">
          <h1 className="text-2xl">Home Page</h1>
          <button
            onClick={() => setUserData(null)}
            className="bg-gray-300 py-3 px-4 text-2xl rounded-lg"
          >
            Sing Out
          </button>
        </div>
        <div className="flex justify-center p-4 items-center">
          <div className="flex bg-white text-center p-4 shadow-lg w-[600px] justify-between ">
            <h2 className="text-2xl text-zinc-500">Add your Picture</h2>
            <div className="flex gap-y-2 items-center flex-col gap-x-2">
              {imageUrl ? (
                <img
                  className="w-20 h-20 rounded-full"
                  src={imageUrl ? imageUrl : ""}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-400"></div>
              )}

              <label htmlFor="fileImage">
                <h1 className="text-3xl px-3 py-1 text-center cursor-pointer bg-blue-500 text-white rounded-lg">
                  +
                </h1>
              </label>
              <input
                className="hidden"
                onChange={handleImage}
                type="file"
                id="fileImage"
                name="fileImage"
              />

              {fileImage && (
                <div className="flex flex-col">
                  <button
                    onClick={uploadImage}
                    className="bg-slate-500 py-2 px-3  rounded-lg"
                  >
                    {loadingImage ? (
                      <TailSpin className="w-8 h-8" />
                    ) : (
                      "Upload Image"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
