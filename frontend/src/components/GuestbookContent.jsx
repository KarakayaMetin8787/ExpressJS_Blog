import { useEffect, useState } from "react";
import 'tailwindcss/tailwind.css';
import { backendURL } from "./../api/api";

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

    return ( 
        <section className="font-mono w-3/5">
            {guestbookContent?.map((item, index) => {
                return <div className="text-xl  bg-slate-700 p-2 my-2 flex" key={index}>
                            <div className="border-solid border-r border-white p-4 self-center">
                                <img className="object-contain p-1 w-36" src={item.bild !== "" ? `http://localhost:3001/imageUploads/${item.bild}` : "/userImage.png"} 
                                alt="profilbild" />
                            </div>
                            <div className="grid grid-cols-2 p-4 grow">
                                <p className="text-xl font-mono text-white font-bold">{item.nachname.toString()},</p>
                                <p className="text-xl font-mono text-white italic text-right">{item.email.toString()}</p>
                                <p className="text-xl font-mono text-white font-bold">{item.vorname.toString()}:</p>
                                <p></p>
                                <p></p>
                                <br />
                                <p className="text-xl font-mono text-white">{item.nachricht.toString()}</p>
                                <br />
                                <br />
                            </div>
                            <div className="border-solid border-l border-white p-4 flex flex-col gap-20 self-center w-16">
                                <img src="./src/assets/images/edit.png" alt="edit button" />
                                <img src="./src/assets/images/delete.png" alt="delete button" />
                            </div>
                        </div>
            })}
        </section>
    );
}
 
export default GuestbookContent;