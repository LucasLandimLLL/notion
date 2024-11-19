"use server";  

import { adminDb } from "@/firebase-admin";  
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";  

export async function criacaoNovoDocumento() {

    const { sessionClaims } = await auth();  // Verifica se o usuário está autenticado.
    
    if (!sessionClaims) throw new Error("Not authenticated");

    const docCollectionRef = adminDb.collection("documents")
    const docRef = await adminDb.collection("documents").add({ title: "Novo documento" });  // Cria o documento.

    // Adiciona o usuário como "owner ou proprietario" no documento.
    await adminDb
        .collection('users')
        .doc(sessionClaims.email)
        .collection('rooms')
        .doc(docRef.id)
        .set({
            userId: sessionClaims.email,
            role: "owner",
            createdAt: new Date(),
            roomId: docRef.id,
        });

    return { docId: docRef.id };  // Retorna o ID do documento.
}

export async function deletarDocumento(roomId: string) {

    console.log("deleteDocument", roomId)

    try {

        console.log(roomId)
        // Exclua a própria referência do documento.

        await adminDb.collection("documents").doc(roomId).delete();

        const query = await adminDb
            .collectionGroup("rooms")
            .where("roomId", "==", roomId)
            .get();

        const batch = adminDb.batch()

        // Exclua a referência da sala na coleção do usuário para cada usuário na sala.

        query.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        // deletar to liveblocks
        await liveblocks.deleteRoom(roomId);

    } catch (error) {
        console.error(error);
        return {success : false};
    }
}

export async function convidarUsuarioParaDocumento(roomId: string, email: string) {
    console.log("convidarUsuarioParaDocumento", roomId, email);

    try {
        await adminDb
            .collection("users")
            .doc(email)
            .collection("rooms")
            .doc(roomId)
            .set({
                userId:email,
                role: "editor",
                createdAt: new Date(),
                roomId,
            });

    } catch (error) {
        console.error(error)
        return {success: false};
    }
}

export async function removerUsuarioDoDocumento(roomId: string, email: string){
    console.log("removerUsuarioDoDocumento", roomId, email);

    try {
        await adminDb
            .collection("users")
            .doc(email)
            .collection("rooms")
            .doc(roomId)
            .delete();
        
        return { success: true};
    } catch (error) {
        console.error(error);
        return{ success : false }
    }
}