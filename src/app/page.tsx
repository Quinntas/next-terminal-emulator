"use client"

import React, {useEffect, useState} from "react";
import {useShell} from "@/components/shell-provider";
import {useTheme} from "@/components/theme-provider";
import {History as HistoryInterface} from "@/lib/types";
import Ps1 from "@/components/ps1";

export default function () {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const {theme} = useTheme();
    const [value, setValue] = useState('');
    const {
        setCommand,
        history,
        lastCommandIndex,
        setHistory,
        setLastCommandIndex,
        clearHistory,
    } = useShell();

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
        }
    }, [history]);

    const onClickAnywhere = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const onSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        const commands: string[] = history
            .map(({command}) => command)
            .filter((value: string) => value);

        if (event.key === 'c' && event.ctrlKey) {
            event.preventDefault();

            setValue('');

            setHistory('');

            setLastCommandIndex(0);
        }

        if (event.key === 'l' && event.ctrlKey) {
            event.preventDefault();

            clearHistory();
        }

        if (event.key === 'Tab') {
            event.preventDefault();

            // handleTabCompletion(value, setValue);
        }

        if (event.key === 'Enter' || event.code === '13') {
            event.preventDefault();

            setLastCommandIndex(0);

            setCommand(value);

            setValue('');
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();

            if (!commands.length) {
                return;
            }

            const index: number = lastCommandIndex + 1;

            if (index <= commands.length) {
                setLastCommandIndex(index);
                setValue(commands[commands.length - index]);
            }
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();

            if (!commands.length) {
                return;
            }

            const index: number = lastCommandIndex - 1;

            if (index > 0) {
                setLastCommandIndex(index);
                setValue(commands[commands.length - index]);
            } else {
                setLastCommandIndex(0);
                setValue('');
            }
        }
    };

    React.useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [history]);

    return <div
        className="min-w-max text-xs md:min-w-full md:text-base"
        onClick={onClickAnywhere}
        style={{
            color: theme.foreground,
        }}
    >
        <main
            className="w-full h-full p-2"
            style={{
                background: theme.background,
            }}
        >

            <div
                className="overflow-hidden h-full rounded"
                style={{
                    borderColor: theme.white,
                    padding: 8,
                    borderWidth: 0,
                }}
            >
                <div ref={containerRef} className="overflow-y-auto h-full">
                    {history.map((entry: HistoryInterface, index: number) => (
                        <div key={entry.command + index}>
                            <div className="flex flex-row space-x-2">
                                <div className="flex-shrink">
                                    <Ps1/>
                                </div>

                                <div className="flex-grow">{entry.command}</div>
                            </div>

                            <p
                                className="whitespace-pre-wrap mb-2"
                                style={{lineHeight: 'normal'}}
                                dangerouslySetInnerHTML={{__html: entry.output}}
                            />
                        </div>
                    ))}

                    <div className="flex flex-row space-x-2">
                        <label htmlFor="prompt" className="flex-shrink">
                            <Ps1/>
                        </label>

                        <input
                            ref={inputRef}
                            id="prompt"
                            type="text"
                            className="focus:outline-none flex-grow"
                            aria-label="prompt"
                            style={{
                                backgroundColor: theme.background,
                            }}
                            value={value}
                            onChange={(event) => setValue(event.target.value)}
                            autoFocus
                            onKeyDown={onSubmit}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                        />
                    </div>
                </div>
            </div>
        </main>
    </div>
}