
import React from 'react';
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full py-6 px-8", className)}>
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-focus-in">
              <div className="text-2xl font-display font-semibold tracking-tight">textemo</div>
              <div className="text-xs font-sans text-muted-foreground">text emotion analysis</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
