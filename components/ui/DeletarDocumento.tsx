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
import { useState, useTransition } from "react";
import { Button } from "./button";
import { usePathname, useRouter } from "next/navigation";
import { deletarDocumento } from "../acoes/acoes";
import { toast } from "sonner";
  

export default function DeletarDocumento() {

const [estaAberto, setEstaAberto] = useState(false);
const [isPending, startTransition] = useTransition();
const pathname = usePathname();
const router = useRouter();

const handleDelete = async () => {
    const roomId = pathname.split('/').pop();
    if (!roomId) return;

    startTransition(async () => {
        const response = await deletarDocumento(roomId);
        
        if(response && response.success) {
            setEstaAberto(false);
            router.replace('/');
            toast.success("Documento deletado com sucesso!");
        } else {
            toast.error("Erro ao Deletar o Documento!");
        }
    })
};

  return (
    <Dialog open={estaAberto} onOpenChange={setEstaAberto}>
        <Button asChild variant="destructive">
            <DialogTrigger>Deletar</DialogTrigger>
        </Button>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Você tem certeza absoluta?</DialogTitle>
                <DialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente da sua conta este documento e removerá seus dados de nossos servidores.
                </DialogDescription>
            </DialogHeader>

            <DialogFooter>
                <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
                >
                    {isPending ? "Deletando..." : "Deletado"}
                </Button>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Fechar
                    </Button>
                </DialogClose>
            </DialogFooter>

        </DialogContent>
    </Dialog>

  )
}