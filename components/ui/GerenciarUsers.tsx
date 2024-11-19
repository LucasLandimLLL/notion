"use client"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { FormEvent, useState, useTransition } from "react";
import { Button } from "./button";
import { usePathname, useRouter } from "next/navigation";
import { convidarUsuarioParaDocumento, deletarDocumento, removerUsuarioDoDocumento } from "../acoes/acoes";
import { toast } from "sonner";
import { Input } from "./input";
import { useUser } from "@clerk/clerk-react";
import useDono from "@/lib/useDono";
import { useRoom } from "@liveblocks/react/suspense";
import { useCollection } from "react-firebase-hooks/firestore";
import { collectionGroup, query, where } from "firebase/firestore";
import { db } from "@/firebase";
  

export default function GerenciarUser() {

const room = useRoom();
const { user } = useUser();
const isDono = useDono();
const [estaAberto, setEstaAberto] = useState(false);
const [isPending, startTransition] = useTransition();

const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
);

const handleDelete = (userId: string) => {
    startTransition(async () => {
        if(!user) return;
        
        const { success } = await removerUsuarioDoDocumento(room.id, userId);

        if ( success ) {
            toast.success("Usuário removido com sucesso!")
        } else {
            toast.error("Falha ao remover o usuário!")
        }
    })
};

  return (
    <Dialog open={estaAberto} onOpenChange={setEstaAberto}>
        <Button asChild variant="outline">
            <DialogTrigger>Usuários ({usersInRoom?.docs.length})</DialogTrigger>
        </Button>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Usuários com acesso!</DialogTitle>
                <DialogDescription>
                    Está é uma lista de usuários com acesso a este documento!
                </DialogDescription>
            </DialogHeader>

            <hr className="my-2"/>

            <div className="flex flex-col space-y-2">
                {usersInRoom?.docs.map((doc) => (
                    <div
                    key={doc.data().userId}
                    className="flex items-center justify-between"
                    >   
                        <p className="font-light">
                            {doc.data().userId === user?.emailAddresses[0].toString()
                            ? `You (${doc.data().userId})`
                            : doc.data().userId}
                        </p> 

                        <div className="flex items-center gap-2">
                            <Button variant="outline">{doc.data().role}</Button>

                            {isDono &&
                                doc.data().userId !== user?.emailAddresses[0].toString() && (
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDelete(doc.data().userId)}
                                        disabled={isPending}
                                        size="sm"
                                    >
                                        {isPending ? "Removendo..." : "x"}
                                    </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </DialogContent>
    </Dialog>

  )
}