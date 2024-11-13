"use server";

import { adminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";

export async function criacaoNovoDocumento() {
    const { sessionClaims } = await auth();

    if (!sessionClaims) {
        throw new Error("Not authenticated");
    }

    const docColecaoRef = adminDb.collection("documents");
    const docRef = await docColecaoRef.add({
        title: "Novo documento"
    });

    await adminDb.collection('users').doc(sessionClaims.email).collection('rooms').doc(docRef.id).set({
        userId: sessionClaims.email,
        role: "owner",
        createdAt: new Date(),
        roomId: docRef.id,
    });

    return { docId: docRef.id };
}
