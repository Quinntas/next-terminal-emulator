"use client"

import React, {useCallback, useEffect, useState} from 'react';
import Themes from '../../themes.json';
import {Theme} from "@/lib/types";

export interface ThemeContextType {
    setTheme: (name: string) => string;
    theme: Theme;
    isLoaded: boolean;
}

// @ts-ignore
const ThemeContext = React.createContext<ThemeContextType>(null);

interface Props {
    children: React.ReactNode;
}

export const useTheme = () => React.useContext(ThemeContext);

export const ThemeProvider: React.FC<Props> = ({children}) => {
    const [theme, _setTheme] = useState<Theme>(Themes[0]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const themeName = savedTheme || 'irblack';

        const index = Themes.findIndex(
            (colorScheme) => colorScheme.name.toLowerCase() === themeName,
        );

        if (index !== -1) {
            _setTheme(Themes[index]);
        }

        setIsLoaded(true);
    }, []);

    const setTheme = useCallback((name: string) => {
        const index = Themes.findIndex(
            (colorScheme) => colorScheme.name.toLowerCase() === name,
        );

        if (index === -1) {
            return `Theme '${name}' not found. Try 'theme ls' to see the list of available themes.`;
        }

        _setTheme(Themes[index]);
        localStorage.setItem('theme', name);

        return `Theme ${Themes[index].name} set successfully!`;
    }, []);

    return (
        <ThemeContext.Provider value={{theme, setTheme, isLoaded}}>
            {children}
        </ThemeContext.Provider>
    );
};