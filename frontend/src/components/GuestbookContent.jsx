import { useEffect, useState } from "react";
import 'tailwindcss/tailwind.css';
import { backendURL } from "./../api/api";
import deletePic from "./../assets/images/delete.png";
import editPic from "./../assets/images/edit.png";

const GuestbookContent = () => {

    const [guestbookContent, setGuestbookContent] = useState([]);
    const [editedText, setEditedText] = useState("");

    useEffect(() => {
        fetch(`${backendURL}/api/guestbook`)
        .then((res) => res.json())
        .then(({ success, result, error }) => {
            if ( !success ) throw error
            setGuestbookContent(result)
        })
    },[])

    const setNewText = (item) => {
        setEditedText(item.target.value)
    }

    const sendEditedText = async (item) => {
        item.nachricht = editedText;
        try {
            await fetch(`${backendURL}/api/guestbook/entry/${item.id}`, {
                method: "PATCH", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nachricht: `${item.nachricht}`})
            })
            .then((res) => res.json())
            .then(data => { console.log(data);
            }) 
        } catch (err) {
            console.log("Error: ", err);
        }
        document.getElementById(`${item.id}`).classList.toggle("hidden")
        document.getElementById(`backgroundFocusChange`).classList.toggle("hidden")
        document.getElementById(`button${item.id}`).classList.toggle("hidden")
        location.reload()
    }

    const changeEntryMessage = (item) => {
        document.getElementById(`${item.id}`).classList.toggle("hidden")
        document.getElementById(`backgroundFocusChange`).classList.toggle("hidden")
        document.getElementById(`button${item.id}`).classList.toggle("hidden")
    }

const deleteConfirmWindow = (item) => {
    document.getElementById(`backgroundFocusChange`).classList.toggle("hidden")
    document.getElementById(`buttonForDeletion${item.id}`).classList.toggle("hidden")
    document.getElementById(`buttonForCancelDeletion${item.id}`).classList.toggle("hidden")
    document.getElementById(`wholeEntryContainer${item.id}`).classList.toggle("z-20")
    document.getElementById(`disableButtons${item.id}`).classList.toggle("hidden")
}

    const deleteEntry = (item) => {
        fetch(`${backendURL}/api/guestbook/entry/${item.id}`, {
            method: "DELETE",
        })
        .then((res) => res.json())
        .then(({ success, result, error }) => {
            if (!success) console.log(error);
            else (result)
        })
        location.reload()
    }
    
    return ( 
        <section className="font-mono w-3/5">
            <div id="backgroundFocusChange" className="fixed top-0 left-0 w-full h-full bg-black opacity-80 z-10 hidden"></div>
            {guestbookContent?.map((item, index) => {
                return <div id={`wholeEntryContainer${item.id}`} className="text-xl relative bg-slate-700 p-2 my-2 flex" key={index}>
                            <div className="border-solid border-r border-white p-4 self-center">
                                <img className="object-contain p-1 min-w-36 max-w-36" src={item.bild !== "" ? `${backendURL}/imageUploads/${item.bild}` : "/userImage.png"} 
                                alt="profilbild" />
                            </div>
                            <div className="grid grid-cols-2 p-4 grow relative">
                                <p className="text-xl font-mono text-white font-bold">{item.vorname.toString()} {item.nachname.toString()} schreibt:</p>
                                <p className="text-xl font-mono text-white italic text-right">{item.email.toString()}</p>
                                <p className="text-xl font-mono text-white col-span-2 h-[110px] overflow-hidden overflow-ellipsis line-clamp-4">{item.nachricht.toString()}</p>
                                <textarea id={item.id} onChange={(item) => setNewText(item)} type="text" placeholder={item.nachricht} className="top-[47px] left-4 bg-slate-700 absolute text-xl font-mono text-white w-[95%] h-[115px] hidden z-20"/>
                                <button id={`button${item.id}`} className="w-60 h-16 bg-lime-900 text-white absolute top-[155px] right-6 hidden z-20 cursor-pointer active:bg-lime-950" onClick={() => sendEditedText(item)} >neue Nachricht übernehmen</button>
                            </div>
                            <div className="border-solid border-l border-white p-4 flex flex-col gap-20 self-center min-w-16 max-w-16 relative">
                                <img className="cursor-pointer hover:scale-150 transition-all" onClick={() => changeEntryMessage(item)} src={editPic} alt="edit button" />
                                <img className="cursor-pointer hover:scale-150 transition-all" onClick={() => deleteConfirmWindow(item)} src={deletePic} alt="delete button" />
                                <button id={`buttonForDeletion${item.id}`}  className="w-60 h-16 bg-red-700 text-white absolute top-[240px] right-6 hidden z-40 cursor-pointer active:bg-red-950" onClick={() => deleteEntry(item)}>Eintrag löschen</button>
                                <button id={`buttonForCancelDeletion${item.id}`}  className="w-36 h-16 bg-lime-900 text-white absolute top-[155px] right-6 hidden z-40 cursor-pointer active:bg-lime-950" onClick={() => deleteConfirmWindow(item)}>Zurück</button>
                                <div id={`disableButtons${item.id}`} className="absolute top-[-9px] right-[-8px] w-[70px] h-[192px] bg-black opacity-80 z-30 hidden"></div>
                            </div>
                        </div>
            })}
            <div className="h-28"></div>
        </section>
    );
}

export default GuestbookContent;