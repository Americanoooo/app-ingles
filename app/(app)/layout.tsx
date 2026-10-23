
import { Navbar } from "@/app/components/Navbar";
import { AuthGuard } from "../components/AuthGuard";

export default function AppLayout({children} : {children: React.ReactNode}){
    return (
        <>
        <AuthGuard>
        <Navbar />
        {children}
        </AuthGuard>
        </>
    )
}