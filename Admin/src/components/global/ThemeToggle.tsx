import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            onClick={toggleTheme}
            className="relative flex items-center gap-2 h-9 px-3 w-fit ml-auto border"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute left-3 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="ml-1 text-sm font-medium">
                {isDark ? 'Dark' : 'Light'} Theme
            </span>
        </Button>
    );
}
