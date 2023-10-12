import express, { Request, Response } from "express";
import { db } from "./firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import bodyParser from "body-parser";
import imageRoute from "./routes/imageRoute";
import axios from "axios";
const app = express();

app.use(bodyParser.json());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("app is Working :)");
});

// Route
app.use("/images", imageRoute);

// whit Get method
app.get(
  "/shorten",
  async (
    req: Request,
    res: Response
  ): Promise<void | Response<string, Record<string, string>>> => {
    const { link } = req.query;

    if (!link) {
      return res.status(400).json({ error: "Missing URL to shorten" });
    }

    try {
      const response = await axios.get(
        `https://is.gd/create.php?format=json&url=${link}`
      );
      const shortLink = response.data.shorturl;
      const linksRef = collection(db, "Links");
      await addDoc(linksRef, { originalUrl: link, shortUrl: shortLink });
      console.log(shortLink);

      res.status(200).json({ shortLink });
    } catch (error) {
      console.error("Error shortening URL:", error);
      res.status(500).json({ error: "Failed to shorten URL" });
    }
  }
);
// post Method
app.post("/shorten", async (req: Request, res: Response):  Promise<void | Response<string, Record<string, string>>> => {
  const data = req.body;

  if (!data) {
    return res.status(400).json({ error: "Missing data to shorten" });
  }
  if (!data.imageUrl) {
    return res.status(404).send("no data");
  } else {
    try {
      const response = await axios.get(
        `https://is.gd/create.php?format=json&url=${data.imageUrl}`
      );
      const shortLink = response.data.shorturl;
      const linksRef = collection(db, "Links");
      await addDoc(linksRef, {
        originalUrl: data.imageUrl,
        shortUrl: shortLink,
      });
      console.log(shortLink);

      res.status(200).json({ shortLink });
    } catch (error) {
      console.error("Error shortening URL:", error);
      res.status(500).json({ error: "Failed to shorten URL" });
    }
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
