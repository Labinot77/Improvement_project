
'use client'
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/Modalprovider";

export default function Page() {
    const { open } = useModal();

    return (
        <div>
            <h1 className="text-3xl font-bold">Settings</h1>


            <Button onClick={() => open("profile", {})}>
                Edit Profile
            </Button>
        </div>
    )
}