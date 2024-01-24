const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const { body, validationResult } = require("express-validator");
const multer = require("multer");

// const uploadMiddleware = multer({ dest: "./uploads" });

const app = express();

app.use(cors());

app.use((req, _, next) => {
    console.log("new request", req.method, req.url);
    next();
});

app.use("/imageUploads", express.static("uploads")) //http://localhost:3001/me.png aufrufe, dann würde express static nach dem pfad schauen und wenn vorhanden returnen

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

app.use(express.json());

app.get("/api/guestbook", async (_, res) => {
    try {
        const data = await fs.readFile("./data.json");
        const entries = JSON.parse(data.toString());
        res.status(200).json({ success: true, result: entries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "failed loading guestbook entries" });
    }
});

app.post("/api/upload", upload.single("file"), (_, res) => {
    res.json({ message: "File upload erfolgreich" })
})

app.post("/api/guestbook/entry", [
    body("guestbookEntry.vorname").isLength({ min: 1 }).withMessage("Vorname ist falsch definiert"),
    body("guestbookEntry.nachname").isLength({ min: 1 }).withMessage("Nachname ist falsch definiert"),
    body("guestbookEntry.email").isEmail().withMessage("Email ist falsch definiert"),
    body("guestbookEntry.nachricht").trim().isLength({ min: 1, max: 500 }).withMessage("Nachricht ist falsch definiert")
], async (req, res) => {
    console.log(req.file);
    console.log(req.body);
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ success: false, errors: errors.array() })
        }
        console.log("req body log", req.body.guestbookEntry);
        const newGuestbookEntry = req.body.guestbookEntry;

        const data = await fs.readFile("./data.json");
        const entries = JSON.parse(data.toString());

        const trimAllWhitespace = (str) => str.replace(/^\s+|\s+$/g, ''); // Regular expression to trim all whitespace

        const newEntryItem = {
            id: new Date(),
            vorname: trimAllWhitespace(newGuestbookEntry.vorname),
            nachname: trimAllWhitespace(newGuestbookEntry.nachname),
            email: trimAllWhitespace(newGuestbookEntry.email),
            nachricht: trimAllWhitespace(newGuestbookEntry.nachricht),
            bild: newGuestbookEntry.bild
        };
        console.log("zeile 71", newGuestbookEntry);
        console.log("zeile 72", newEntryItem);
        
        const updatedGuestbook = [...entries, newEntryItem];

        await fs.writeFile("./data.json", JSON.stringify(updatedGuestbook, null, 2));

        res.json({ success: true, result: newEntryItem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "failed to add new guestbook entry" });
    }
});

app.patch("/api/guestbook/entry/:id", (req, res) => {
    const id = req.params.id;
    readJsonFile("./data.json")
    .then((entries) => {
        const updateEntry = entries.map((entry) => {
            if (entry.id.toString() === id) {
                return {...entry, nachricht: req.body.nachricht}
            } else {
                return entry
            }
        })
        return updateEntry
    })
    .then((newEntryArray) => writeJsonFile("./data.json", newEntryArray))
    .then((newEntryArray) => {
        res.status(200).json({ success: true, result: newEntryArray })
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ success: false, error: "failed to update entry"})
    })
})


app.use((_, res) => {
    res.status(404).json({ success: false, error: "route not found" });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log("Server is ready on Port: " + PORT);
});
