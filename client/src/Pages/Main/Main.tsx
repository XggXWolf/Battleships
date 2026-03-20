import FriendsMenuButton from "../../Components/FriendsPanel/FriendsMenuButton";
import GamePanel from "../../Components/GamePanel/GamePanel";
import SidePanel from "../../Components/SidePanel/SidePanel";

function Main() {
    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 grow overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
                <GamePanel />
                <SidePanel />
                <FriendsMenuButton />
            </div>
        </main>
    );
}

export default Main;
