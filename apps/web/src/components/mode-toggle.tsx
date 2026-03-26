"use client";

import { Check, Moon, Sun } from "lucide-react";

import { useThemeModeController } from "@/components/theme/theme-mode-controller";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
	const { mode, setMode } = useThemeModeController();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						aria-label="Change theme mode"
						size="icon"
						variant="outline"
					/>
				}
			>
				<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				<span className="sr-only">Change theme mode</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setMode("light")}>
					Light
					{mode === "light" && <Check className="ml-auto size-4" />}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setMode("dark")}>
					Dark
					{mode === "dark" && <Check className="ml-auto size-4" />}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setMode("time-based")}>
					Time-based
					{mode === "time-based" && <Check className="ml-auto size-4" />}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
