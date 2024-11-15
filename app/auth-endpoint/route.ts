import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { sessionClaims } = await auth();
    const { room } = await req.json();

    if (!sessionClaims) {
        return NextResponse.json({ message: "Autenticação falhou", status: 401 });
    }

    const session = liveblocks.prepareSession(sessionClaims.email, {
        userInfo: {
            name: sessionClaims.fullName,
            email: sessionClaims.email,
            avatar: sessionClaims.image,
        },
    });

    const usersInRoom = await adminDb
        .collectionGroup("rooms")
        .where("userId", "==", sessionClaims.email)
        .get();

    const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

    if (userInRoom) {
        session.allow(room, session.FULL_ACCESS);
        const { body, status } = await session.authorize();

        console.log("Você está autorizado");

        return new Response(body, { status });
    } else {
        return NextResponse.json(
            { message: "Você não está nessa sala" },
            { status: 403 }
        );
    }
}
