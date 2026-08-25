
import { Navbar } from "@/lib/Navbar";

export default function AppLayout({children} : {children: React.ReactNode}){
    return (
        <>
        <Navbar />
        {children}
        </>
    )
}