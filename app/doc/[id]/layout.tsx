import RoomProvider from "@/components/ui/RoomProvider";
import { auth } from "@clerk/nextjs/server"

function DocLayout({
    children, params: {id}}:
    {children: React.ReactNode, params: {id: string};})
    {
    auth();

    return <RoomProvider roomId={id}>{children}</RoomProvider>;
    
}
export default DocLayout