import React, { useState } from "react";
import './../../node_modules/tailwindcss/tailwind.css';

const GuestbookEntry = () => {
  const [formInput, setFormInput] = useState({
    vorname: "",
    nachname: "",
    email: "",
    nachricht: "",
    bild: ""
  });

  const [file, setFile] = useState("");

  const handleChange = (e) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("file", file);

  //   fetch("http://localhost:3001/api/upload", {
  //     method: "POST",
  //     body: formData,
  //   })
  //   .then((response) => {
  //     if (response.ok) {
  //       console.log("File upload erfolgreich");
  //       if (file !== ""){
  //         setFormInput((prevState) => ({ ...prevState, bild: file.name }))
  //       }
  //     } else {
  //       console.log("File upload fehlgeschlagen");
  //     }
  //   })
  //   .catch((error) => {
  //     console.log("Error: ", error);
  //   })
  //   fetch("http://localhost:3001/api/guestbook/entry", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ guestbookEntry: formInput }),
  //   })
  //   .then((response) => {
  //     if (response.ok) {
  //       console.log("Eintrag übertragen");
  //     } else {
  //       console.log("Übertragungsfehler");
  //     }
  //   })
  //   .catch((error) => {
  //     console.log("Error:", error);
  //   })
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:3001/api/upload", {
      method: "POST",
      body: formData,
    })
    try {
      if (response.ok) {
        await fetch("http://localhost:3001/api/guestbook/entry", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ guestbookEntry: formInput }),
        })
        .then((response) => {
          if (response.ok) {
            console.log("Eintrag übertragen");
          } else {
            console.log("Übertragungsfehler");
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        })
        console.log("File upload erfolgreich");
        if (file !== ""){
          setFormInput((prevState) => ({ ...prevState, bild: file.name }))
        }
      } else {
        console.log("File upload fehlgeschlagen");
      }
    } catch(err) {
      console.log("Error: ", err);
    }


  };

  console.log(formInput);

  return (
    <section className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-99 gap-4 py-8">
        <div className="flex gap-4 w-3/5 ">
        <input
          className="border-solid	border-black border	p-2 w-1/2 bg-white"
          type="text"
          placeholder="Vorname"
          name="vorname"
          value={formInput.vorname}
          onChange={handleChange}
        />
        <input
          className="border-solid	border-black border	p-2 w-1/2 bg-white"
          type="text"
          placeholder="Nachname"
          name="nachname"
          value={formInput.nachname}
          onChange={handleChange}
        />
        </div>
        <input
          className="border-solid	border-black border	p-2 w-3/5"
          type="email"
          placeholder="Email"
          name="email"
          value={formInput.email}
          onChange={handleChange}
        />
        <textarea
          className="border-solid	border-black border	p-2 w-3/5 h-24"
          type="text"
          placeholder="Nachricht"
          name="nachricht"
          value={formInput.nachricht}
          onChange={handleChange}
        />
        <div className="flex gap-4 w-3/5 ">
          <label 
          htmlFor="file" 
          className="border-solid border-black border p-2 w-1/2 bg-white cursor-pointer">Bild hochladen...
            <input 
            id="file"
            className="hidden" 
            type="file" 
            name="file" 
            onChange={handleFileChange}
            />
          </label>
          <input type="submit" value="Posten" className="border-solid	border-black border	p-2 w-1/2 bg-white cursor-pointer" />
        </div>
      </form>
    </section>
  );
};

export default GuestbookEntry;
