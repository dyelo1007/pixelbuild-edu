import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, User as UserIcon } from "lucide-react";

type UserMenuProps = {
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
  onAccountSettings?: () => void;
  onLogout: () => void;
};

const UserMenu = ({
  name,
  email,
  role,
  avatarUrl,
  onAccountSettings,
  onLogout,
}: UserMenuProps) => {
  const initial = name?.charAt(0)?.toUpperCase() || "U";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 p-0 hover:bg-transparent focus-visible:ring-0"
        >
          <Avatar className="h-8 w-8 border border-[#51ab91]">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-gray-100 text-gray-800 dark:bg-white dark:text-darkbg font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="
          w-60 p-4 rounded-xl shadow-lg
          bg-white text-gray-900 border border-[#51ab91]
          dark:bg-[#212121] dark:text-white dark:border-[#51ab91]
        "
      >
        {/* Top: Avatar, Name, Email */}
        <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 w-full">
          <Avatar className="h-10 w-10 border border-[#51ab91]">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-gray-100 text-gray-800 dark:bg-white dark:text-darkbg">
              <UserIcon className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{name}</p>
            <p
              className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-full overflow-hidden whitespace-nowrap block"
              title={email}
            >
              {email}
            </p>
            <p
              className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-full overflow-hidden whitespace-nowrap block"
              title={role || "Student"}
            >
              {role || "Student"}
            </p>
          </div>
        </div>

        {/* Menu Options */}
        <div className="flex flex-col space-y-1 pt-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-sm text-gray-900 hover:text-[#51ab91] dark:text-white dark:hover:text-[#51ab91]"
            onClick={onAccountSettings}
          >
            <Settings className="mr-2 h-4 w-4" /> Account Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
