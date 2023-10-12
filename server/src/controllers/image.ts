import { Request, Response } from "express";
import { db } from "../firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export const addImage = async (req: Request, res: Response) => {
  const data = req.body;
  console.log(data.imageUrl);
  if (data.imageUrl) {
    try {
      const imageRef = collection(db, "Image");
      const docRef = await addDoc(imageRef, data);
      console.log(Object(data).keys);
      res.send({ msg: "Image added to Firebase Firestore", id: docRef.id });
    } catch (error) {
      console.error("Error adding image to Firestore:", error);
      res.status(500).send({ error: "Failed to add image to Firestore" });
    }
  } else {
    return res.status(400).json({ msg: "was in Error" });
  }
};

export const getImagesLinks = async (req: Request, res: Response) => {
  try {
    const imageCollection = collection(db, "Image");
    const querySnapshot = await getDocs(imageCollection);

    const links: any = [];
    querySnapshot.forEach((doc) => {
      links.push(doc.data().imageUrl);
    });

    res.json(links);
  } catch (error) {
    console.error("Error retrieving images from Firestore:", error);
    res.status(500).json({ error: "Failed to retrieve images from Firestore" });
  }
};

export const updateImageLink = async (req: Request, res: Response) => {
  const data = req.body;
  const { id } = req.params;

  if (!data.imageUrl) {
    return res.status(400).json({ msg: " Error" });
  } else {
    try {
      const imageRf = doc(collection(db, "Image"), id);
      await updateDoc(imageRf, data);
      res.send({ msg: "Image updated in Firebase Firestore" });
    } catch (error) {
      console.error("Error updating image in Firestore:", error);
      res.status(500).send({ error: "Failed to update image in Firestore" });
    }
  }
};
export const deleteImageLink = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: " Id does not exited" });
  } else {
    try {
      const imageRf = doc(collection(db, "Image"), id);
      await deleteDoc(imageRf);
      res.send({ msg: "Image Deleted in Firebase Firestore" });
    } catch (error) {
      console.error("Error updating image in Firestore:", error);
      res.status(500).send({ error: "Failed to update image in Firestore" });
    }
  }
};
