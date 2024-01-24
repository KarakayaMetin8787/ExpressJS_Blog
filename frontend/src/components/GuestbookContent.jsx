import { useEffect, useState } from "react";
import 'tailwindcss/tailwind.css';

const GuestbookContent = () => {

    const [guestbookContent, setGuestbookContent] = useState([]);
    
    useEffect(() => {
        fetch("http://localhost:3001/api/guestbook")
        .then((res) => res.json())
        .then(({ success, result, error }) => {
            if ( !success ) throw error
            setGuestbookContent(result)
        })
    },[])

    console.log(guestbookContent);

    return ( 
        <section className="font-mono w-3/5">
            {guestbookContent?.map((item, index) => {
                return <div className="text-xl  bg-slate-700 p-2 my-2 flex" key={index}>
                            <div className="">
                                <img className="object-contain p-1" src={item.bild !== "" ? `./../backend/uploads/${item.bild}` : "/userImage.png"} 
                                alt="profilbild" />
                                {/* <img src={`http://localhost:3001/api/guestbook/${item.bild}`} /> */}
                            </div>
                            <div className="grid grid-cols-2 p-1 grow">
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
                        </div>
            })}
        </section>
    );
}
 
export default GuestbookContent;