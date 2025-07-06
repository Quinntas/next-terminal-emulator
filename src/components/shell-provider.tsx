"use client"

import React, {useCallback} from 'react';
import {useTheme} from "@/components/theme-provider";
import {cmdTheme} from "@/lib/cmd/theme";
import {History} from "@/lib/types";

interface ShellContextType {
    history: History[];
    command: string;
    lastCommandIndex: number;

    setHistory: (output: string, commandToStore: string) => void;
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
    const [history, _setHistory] = React.useState<History[]>([]);
    const [command, _setCommand] = React.useState<string>('');
    const [lastCommandIndex, _setLastCommandIndex] = React.useState<number>(0);
    const {theme, setTheme} = useTheme();

    const setHistory = useCallback((output: string, commandToStore: string) => {
        _setHistory(prev => [
            ...prev,
            {
                id: prev.length,
                date: new Date(),
                command: commandToStore,
                output,
            },
        ]);
    }, []);

    const setCommand = useCallback((command: string) => {
        _setCommand(command);
    }, []);

    const clearHistory = useCallback(() => {
        _setHistory([]);
    }, []);

    const setLastCommandIndex = useCallback((index: number) => {
        _setLastCommandIndex(index);
    }, []);

    const execute = useCallback(async (commandToExecute: string) => {
        const [cmd, ...args] = commandToExecute.split(' ');

        switch (cmd) {
            case 'theme':
                const output = await cmdTheme(args, setTheme);
                setHistory(output, commandToExecute);
                break;
            default: {
                setHistory('', commandToExecute);
                break
            }
        }
    }, [setTheme, setHistory]);

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