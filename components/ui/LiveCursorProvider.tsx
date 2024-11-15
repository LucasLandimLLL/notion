"use client"

import { useMyPresence, useOthers } from "@liveblocks/react/suspense";
import { PointerEvent } from "react";
import FollowPointer from "./FollowPointer";

function LiveCursorProvider({ children}: {children: React.ReactNode}){
    const [mtPresence, updateMyPresence] = useMyPresence();
    const others= useOthers();
//atualização de onde o cursor está
    function handlePointerMove(e: PointerEvent<HTMLDivElement>){
        const cursor = {x: Math.floor(e.pageX), y: Math.floor(e.pageY)};
        updateMyPresence({cursor});
    }

    function handlePointerLeave(){
        updateMyPresence({ cursor:null });
    }

    return ( 
    <div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
    > {others.filter((other) => other.presence.cursor !== null)
        .map(({connectionId, presence, info}) => (
        <FollowPointer
        info={info}
        key={connectionId}
        x={presence.cursor!.x}
        y={presence.cursor!.y}

        />))} 

    {children}
    
    </div>
);
}

export default LiveCursorProvider;



{/*renderização do cursor*/}