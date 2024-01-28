import { useEffect, useState } from "react";
import 'tailwindcss/tailwind.css';
import { backendURL } from "./../api/api";
import deletePic from "./../assets/images/delete.png";
import editPic from "./../assets/images/edit.png";

const GuestbookContent = () => {

    const [guestbookContent, setGuestbookContent] = useState([]);

    useEffect(() => {
        fetch(`${backendURL}/api/guestbook`)
        .then((res) => res.json())
        .then(({ success, result, error }) => {
            if ( !success ) throw error
            setGuestbookContent(result)
        })
    },[])

    const sendEditedText = (item) => {
        console.log(item.target.value);
        fetch(`${backendURL}/api/guestbook/entry/${item.target.id}`, {
            method: "PATCH", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nachricht: `${item.target.value}`})
        })
        .then((res) => res.json())
        .then(data => { console.log(data);
        }) 
        .catch(error => {
            console.log("Error: ", error);
        })
    }

    const changeEntryMessage = (item) => {
        document.getElementById(`${item.id}`).classList.toggle("hidden")
    }
    
    return ( 
        <section className="font-mono w-3/5">
            {guestbookContent?.map((item, index) => {
                return <div className="text-xl  bg-slate-700 p-2 my-2 flex" key={index}>
                            <div className="border-solid border-r border-white p-4 self-center">
                                <img className="object-contain p-1 w-36" src={item.bild !== "" ? `${backendURL}/imageUploads/${item.bild}` : "/userImage.png"} 
                                alt="profilbild" />
                            </div>
                            <div className="grid grid-cols-2 p-4 grow relative">
                                <p className="text-xl font-mono text-white font-bold">{item.vorname.toString()} {item.nachname.toString()} schreibt:</p>
                                <p className="text-xl font-mono text-white italic text-right">{item.email.toString()}</p>
                                <p className="text-xl font-mono text-white col-span-2">{item.nachricht.toString()}</p>
                                <textarea id={item.id} onChange={(item) => sendEditedText(item)} type="text" placeholder={item.nachricht} className="top-[88px] left-4 bg-slate-700 absolute text-xl font-mono text-white w-[95%] h-16 hidden"/>
                            </div>
                            <div className="border-solid border-l border-white p-4 flex flex-col gap-20 self-center w-16">
                                <img onClick={() => changeEntryMessage(item)} src={editPic} alt="edit button" />
                                <img src={deletePic} alt="delete button" />
                            </div>
                        </div>
            })}
        </section>
    );
}

export default GuestbookContent;