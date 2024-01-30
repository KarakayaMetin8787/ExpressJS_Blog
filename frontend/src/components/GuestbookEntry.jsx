import React, { useState } from "react";
import './../../node_modules/tailwindcss/tailwind.css';
import { backendURL } from "./../api/api";


const GuestbookEntry = () => {
  const [formInput, setFormInput] = useState({
    vorname: "",
    nachname: "",
    email: "",
    nachricht: "",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    document.getElementById("labelFileUpload").classList.add("bg-lime-600")
    document.getElementById("labelFileUpload").classList.remove("bg-white")
    document.getElementById("labelFileUpload").textContent = document.getElementById("file").value;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${backendURL}/api/upload`, {
        method: "POST",
        body: formData,
      })
      if (!response.ok) {
        return console.log("File upload fehlgeschlagen")
      } 
      console.log("File upload erfolgreich");

      const responseEntry = await fetch(`${backendURL}/api/guestbook/entry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guestbookEntry: {...formInput, bild: file ? file.name : ""} }),
      })
      if (!responseEntry.ok) {
        return console.log("Übertragungsfehler");
      }
      console.log("Daten erfolgreich übertragen");
    } catch(err) {
      console.log("Error: ", err);
    }
    location.reload()
  };

  return (
    <section className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-99 gap-4 py-8">
        <div className="flex gap-4 w-3/5 ">
        <input
          className="p-2 w-1/2"
          type="text"
          placeholder="Vorname"
          name="vorname"
          value={formInput.vorname}
          onChange={handleChange}
        />
        <input
          className="p-2 w-1/2"
          type="text"
          placeholder="Nachname"
          name="nachname"
          value={formInput.nachname}
          onChange={handleChange}
        />
        </div>
        <input
          className="p-2 w-3/5"
          type="email"
          placeholder="Email"
          name="email"
          value={formInput.email}
          onChange={handleChange}
        />
        <textarea
          className=" p-2 w-3/5 h-24"
          type="text"
          placeholder="Nachricht"
          name="nachricht"
          value={formInput.nachricht}
          onChange={handleChange}
        />
        <div className="flex gap-4 w-3/5 ">
          <label 
          id="labelFileUpload"
          htmlFor="file" 
          className="p-2 w-1/2 bg-white cursor-pointer">Bild hochladen...  (optional)
            <input 
            id="file"
            className="hidden" 
            type="file" 
            // accept=".jpg, .jpeg, .png"
            name="file" 
            onChange={handleFileChange}
            />
          </label>
          <input type="submit" value="Posten" className="active:bg-slate-600 p-2 w-1/2 bg-white cursor-pointer" />
        </div>
      </form>
    </section>
  );
};

export default GuestbookEntry;
