"use client"

import React, {useEffect} from 'react';
import {useTheme} from "@/components/theme-provider";
import {cmdTheme} from "@/lib/cmd/theme";
import {History} from "@/lib/types";

interface ShellContextType {
    history: History[];
    command: string;
    lastCommandIndex: number;

    setHistory: (output: string) => void;
    setCommand: (command: string) => void;
    setLastCommandIndex: (index: number) => void;
    execute: (command: string) => Promise<void>;
    clearHistory: () => void;
}

// @ts-ignore
const ShellContext = React.createContext<ShellContextType>(null);

interface ShellProviderProps {
    children: React.ReactNode;
}

export const useShell = () => React.useContext(ShellContext);

export const ShellProvider: React.FC<ShellProviderProps> = ({children}) => {
    const [init, setInit] = React.useState(true);
    const [history, _setHistory] = React.useState<History[]>([]);
    const [command, _setCommand] = React.useState<string>('');
    const [lastCommandIndex, _setLastCommandIndex] = React.useState<number>(0);
    const {theme, setTheme} = useTheme();

    useEffect(() => {
        // setCommand('banner'); Intro command
    }, []);

    useEffect(() => {
        if (!init) {
            execute();
        }
    }, [command, init]);

    const setHistory = (output: string) => {
        _setHistory([
            ...history,
            {
                id: history.length,
                date: new Date(),
                command: command.split(' ').slice(1).join(' '),
                output,
            },
        ]);
    };

    const setCommand = (command: string) => {
        _setCommand([Date.now(), command].join(' '));

        setInit(false);
    };

    const clearHistory = () => {
        _setHistory([]);
    };

    const setLastCommandIndex = (index: number) => {
        _setLastCommandIndex(index);
    };

    const execute = async () => {
        const [cmd, ...args] = command.split(' ').slice(1);

        switch (cmd) {
            case 'theme':
                const output = await cmdTheme(args, setTheme);
                setHistory(output);
                break;
            default: {
                setHistory('');
                break
            }
        }
    };

    return (
        <ShellContext.Provider
            value={{
                history,
                command,
                lastCommandIndex,
                setHistory,
                setCommand,
                setLastCommandIndex,
                execute,
                clearHistory,
            }}
        >
            {children}
        </ShellContext.Provider>
    );
};
