"use client"

import type React from "react"
import {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {useShell} from "@/components/shell-provider"
import {useTheme} from "@/components/theme-provider"
import type {History as HistoryInterface} from "@/lib/types"
import Ps1 from "@/components/ps1"

export default function Terminal() {
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const {theme, isLoaded} = useTheme()
    const [value, setValue] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {history, execute} = useShell()

    const textareaHeight = useMemo(() => {
        if (!value) return "24px"

        const lines = value.split("\n").length
        const maxLines = 8
        const actualLines = Math.min(lines, maxLines)
        const lineHeight = 24
        return `${actualLines * lineHeight}px`
    }, [value])

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo(0, containerRef.current.scrollHeight)
        }
    }, [history])

    const onClickAnywhere = useCallback(() => {
        if (inputRef.current && !isSubmitting) {
            inputRef.current.focus()
        }
    }, [isSubmitting])

    const onSubmit = useCallback(async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Tab") {
            event.preventDefault()
            return
        }

        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()

            if (isSubmitting) return

            const commandToExecute = value.trim()

            setIsSubmitting(true)
            setValue("")

            try {
                await execute(commandToExecute)
            } finally {
                setIsSubmitting(false)
            }
        }
    }, [value, isSubmitting, execute])

    // Don't render until theme is loaded to prevent flicker
    if (!isLoaded) {
        return null
    }

    return (
        <div
            className="w-full h-screen text-xs md:text-sm lg:text-base font-mono cursor-text"
            onClick={onClickAnywhere}
            style={{
                color: theme.foreground,
                backgroundColor: theme.background,
            }}
        >
            <main className="w-full h-full p-2">
                <div className="h-full w-full overflow-hidden">
                    <div ref={containerRef} className="overflow-y-auto h-full w-full pb-4"
                         style={{scrollbarWidth: "thin"}}>
                        {history.map((entry: HistoryInterface, index: number) => (
                            <div key={`${entry.id}-${index}`} className="mb-1">
                                <div className="flex flex-row">
                                    <div className="flex-shrink-0 mr-1">
                                        <Ps1/>
                                    </div>
                                    <div
                                        className="flex-grow ml-1 whitespace-pre-wrap break-words">{entry.command}</div>
                                </div>
                                {entry.output && (
                                    <pre
                                        className="mb-2 whitespace-pre-wrap break-words text-sm"
                                        style={{
                                            lineHeight: "normal",
                                            fontFamily: "inherit",
                                        }}
                                    >
                                        {entry.output}
                                    </pre>
                                )}
                            </div>
                        ))}

                        <div className="flex flex-row items-start">
                            <label htmlFor="prompt" className="flex-shrink-0 mr-1">
                                <Ps1/>
                            </label>
                            <textarea
                                ref={inputRef}
                                id="prompt"
                                className="focus:outline-none flex-grow resize-none ml-1 overflow-y-auto"
                                aria-label="Terminal input"
                                style={{
                                    backgroundColor: theme.background,
                                    color: theme.foreground,
                                    height: textareaHeight,
                                    minHeight: "24px",
                                    maxHeight: "192px",
                                    lineHeight: "24px",
                                    fontFamily: "inherit",
                                    fontSize: "inherit",
                                    scrollbarWidth: "thin"
                                }}
                                value={value}
                                onChange={(event) => setValue(event.target.value)}
                                onKeyDown={onSubmit}
                                autoFocus
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck={false}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}