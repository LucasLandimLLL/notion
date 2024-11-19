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
import { convidarUsuarioParaDocumento, deletarDocumento } from "../acoes/acoes";
import { toast } from "sonner";
import { Input } from "./input";
  

export default function ConvidarUser() {

const [estaAberto, setEstaAberto] = useState(false);
const [isPending, startTransition] = useTransition();
const [email, setEmail] = useState("")
const pathname = usePathname();
const router = useRouter();

const handleInvite = async (e: FormEvent) => {
    e.preventDefault(); 
    
    const roomId = pathname.split("/").pop();
    if (!roomId) return;


    startTransition(async () => {
        const success = await convidarUsuarioParaDocumento(roomId, email);
        
        if(success) {
            setEstaAberto(false);
            setEmail("")
            toast.success("Usuário adicionado com sucesso!");
        } else {
            toast.success("Usuário adicionado com sucesso!");
        }
    })
};

  return (
    <Dialog open={estaAberto} onOpenChange={setEstaAberto}>
        <Button asChild variant="outline">
            <DialogTrigger>Convidar</DialogTrigger>
        </Button>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Convide um usuário para Colaborar!</DialogTitle>
                <DialogDescription>
                    Insira o Email do usuário que deseja convidar.
                </DialogDescription>
            </DialogHeader>

            <form className="flex gap-2 " onSubmit={handleInvite}>
                <Input
                  type="email"
                  placeholder="email"
                  className="w-full"
                  value={email}
                  onChange={(e)=> setEmail(e.target.value)}  
                />
                <Button type="submit" disabled={!email || isPending}>
                    {isPending ? "Convidando..." : "Convidado"}
                </Button>
            </form>

        </DialogContent>
    </Dialog>

  )
}