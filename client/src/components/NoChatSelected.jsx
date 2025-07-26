import { MessageCircleDashed, MessageSquare } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const NoChatSelected = () => {
  const { users } = useChatStore();
  return (
    <div className="hidden w-full lg:flex flex-1 flex-col items-center justify-center p-16 bg-accent">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl flex items-center
             justify-center animate-bounce"
            >
              <MessageCircleDashed size={60} className="text-primary " />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">Welcome to Whispnet!</h2>
        {users.length > 0 ? (
          <p className="text-base-content/60">
            Select a conversation from the sidebar to start chatting
          </p>
        ) : (
          <p className="text-base-content/60">
            Discover users by pressing the Discover button next to the search
            bar.
          </p>
        )}
      </div>
    </div>
  );
};

export default NoChatSelected;
