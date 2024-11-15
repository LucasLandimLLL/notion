'use client';

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";

function Document({ id }: { id: string }) {
    const[data, loading, error] = useDocumentData(doc(db, "documents", id))
    const [input, setInput] = useState("");
    const [isUpdating, startTransition] = useTransition();

    useEffect(() => {
        if (data) {
            setInput(data.title)
        }
    }, [data])

    const updateTitle = (e: FormEvent) => {
        e.preventDefault ();

        if (input.trim()) {
            startTransition(async () => {
        await updateDoc(doc(db, "documents",id),{
            title: input,
        });
    })
}  
    }

    return (
        <div>
            <div className="flex max-w-7xl mx-auto justify-between pb-5">
                <form style={{ backgroundColor: "white" }} className="flex flex-1 space-x-2 " onSubmit={updateTitle}>
                {/* update title*/}
                <Input value={input} onChange={(e) => setInput(e.target.value)} />

                <Button disabled={isUpdating} type="submit">
                    {isUpdating ? "atualizando..." : "atualizar"} </Button>

                {/* dono, inviteuser, delete*/}
                </form>
            </div>

            <div>
            {/* manageuser*/}

            {/* avatar*/}

            </div>

            {/* collaborative editor*/}
        </div>
    );
}








export default Document;