import { db } from "@/firebase";
import { useUser } from "@clerk/clerk-react";
import { useRoom } from "@liveblocks/react/suspense";
import { collectionGroup, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

export default function useDono() {
  const { user } = useUser();
  const room = useRoom();
  const [useDono, setUseDono] = useState(false);
  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );
  
  useEffect(() => {
    if(usersInRoom?.docs && usersInRoom.docs.length > 0) {
        const dono = usersInRoom.docs.filter(
            (doc) => doc.data().role ==="owner"
        );

        if (
            dono.some(
                (dono) => dono.data().userId === user?.emailAddresses[0].toString()
            )
        )   {
            setUseDono(true);
        }
    }

  }, [usersInRoom, user]);

  return useDono;

}