'use client'

import { MenuIcon } from "lucide-react";
import NovoDocumentoButton from "./NovoDocumentoButton";
import { useCollection } from "react-firebase-hooks/firestore";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useUser } from "@clerk/nextjs";
import { collectionGroup, query, where, DocumentData } from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";

interface RoomDocument extends DocumentData {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
}

export default function Barralateral() {
  const { user } = useUser();
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({
    owner: [],
    editor: [],
  });

  // Função para buscar os dados dos documentos
  const [data, loading, error] = useCollection(
    user &&
      query(
        collectionGroup(db, "rooms"),
        where("userId", "==", user.emailAddresses[0]?.toString())
      )
  );

  useEffect(() => {
    if (!data) return;

    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
    }>(
      (acc, curr) => {
        const roomData = curr.data() as RoomDocument;

        if (roomData.role === "owner") {
          acc.owner.push({
            id: curr.id,
            ...roomData,
          });
        } else {
          acc.editor.push({
            id: curr.id,
            ...roomData,
          });
        }

        return acc;
      },
      { owner: [], editor: [] }
    );

    setGroupedData(grouped);
  }, [data]);

  const menuOptions = (
    <>
      <NovoDocumentoButton />
      <div>
        {/* Meus Documentos */}
        {groupedData.owner.length === 0 ? (
          <h2 className="text-gray-500 font-semibold text-sm">
            Sem documentos encontrados
          </h2>
        ) : (
          <>
            <h2 className="text-gray-500 font-semibold text-sm">
              Meus documentos
            </h2>
            {groupedData.owner.map((doc) => (
              // Adicionando a key para cada item mapeado
              <p key={doc.id}>{doc.roomId}</p>
            ))}
          </>
        )}
      </div>

      {/* Lista */}

      {/* Compartilhado comigo */}
      {/* Lista */}
    </>
  );

  return (
    <div className="p-2 md:p-5 bg-gray-200 relative">
      {/* Menu Lateral no Layout Mobile */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40} />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <div>{menuOptions}</div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      {/* Botão Novo Documento no Layout Desktop */}
      <div className="hidden md:inline">
        <NovoDocumentoButton />
        {groupedData.owner.length === 0 ? (
          <h2 className="text-gray-500 font-semibold text-sm">
            Sem documentos encontrados
          </h2>
        ) : (
          <>
            <h2 className="text-gray-500 font-semibold text-sm">
              Meus documentos
            </h2>
            {groupedData.owner.map((doc) => (
              <p key={doc.id}>{doc.roomId}</p>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
