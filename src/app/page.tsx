import {ThemeProvider} from "@/components/theme-provider"
import {ShellProvider} from "@/components/shell-provider"
import Terminal from "@/components/terminal";

export default function Home() {
    return (
        <ThemeProvider>
            <ShellProvider>
                <div className="h-screen w-screen overflow-hidden">
                    <Terminal/>
                </div>
            </ShellProvider>
        </ThemeProvider>
    )
}
