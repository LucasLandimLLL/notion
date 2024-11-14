"use server";  

import { adminDb } from "@/firebase-admin";  
import { auth } from "@clerk/nextjs/server";  

export async function criacaoNovoDocumento() {
    const { sessionClaims } = await auth();  // Verifica se o usuário está autenticado.
    
    if (!sessionClaims) throw new Error("Not authenticated");

    const docRef = await adminDb.collection("documents").add({ title: "Novo documento" });  // Cria o documento.

    // Adiciona o usuário como "owner ou proprietario" no documento.
    await adminDb.collection('users').doc(sessionClaims.email).collection('rooms').doc(docRef.id).set({
        userId: sessionClaims.email,
        role: "owner",
        createdAt: new Date(),
        roomId: docRef.id,
    });

    return { docId: docRef.id };  // Retorna o ID do documento.
}
