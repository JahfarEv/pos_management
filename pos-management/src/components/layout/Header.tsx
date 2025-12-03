import React, { useState, useRef, useEffect } from "react";
import { useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store";
import { UserStar, Settings } from "lucide-react";

interface HeaderProps {
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => setShowDropdown((s) => !s);
  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    setShowDropdown(false);
  };

  return (
    <header className="bg-blue-800 text-white flex justify-between items-center shadow-md z-10 relative py-1 h-12">
      <div className="font-bold text-lg w-[35.1%] text-center">Sales</div>
      <div className="font-bold text-lg w-[22.8%] text-center border-l border-gray-500">
        Item Category
      </div>
      <div className="font-bold text-lg w-[35.5%] text-center border-l border-gray-500">
        Item Details
      </div>

      <div className="font-bold text-lg w-[7%] text-center flex items-center justify-center gap-3 relative">
        <span className="cursor-pointer hover:bg-blue-700 p-1 rounded transition-colors">
          <Settings />
        </span>

        <div className="relative" ref={dropdownRef}>
          <span
            className="cursor-pointer hover:bg-blue-700 p-1 rounded transition-colors"
            onClick={handleProfileClick}
            title={`Profile (${user?.mobile})`}
          >
            <UserStar />
          </span>

          {showDropdown && (
            <div className="absolute right-0 top-full w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-20">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.mobile}</p>
              </div>

              <button
                onClick={handleLogoutClick}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <span>🚪</span> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
