import { toAbsoluteUrl } from '@/lib/helpers';
import { Moon, Sun, Laptop } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuTrigger
} from '@/components/dropdown-menu';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage, } from '@/components/avatar';
import { cn } from '@/lib/utils';

export function UserPanel() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
		<DropdownMenu>
			<DropdownMenuTrigger className={cn(
				'grow cursor-pointer justify-between flex items-center gap-2.5 lg:mx-2.5 lg:px-2 py-1 rounded-md ring-none outline-none',
				'hover:bg-background data-[state=open]:bg-background',
				'in-data-[sidebar-collapsed=true]:hover:bg-transparent in-data-[sidebar-collapsed=true]:data-[state=open]:bg-transparent',				
			)}>
				<div className="flex items-center gap-1.5">
					<Avatar className="size-8 border border-background rounded-full overflow-hidden">
						<AvatarImage src={toAbsoluteUrl('/media/avatars/300-2.png')} alt="ADP"/>
						<AvatarFallback className="rounded-md">ADP</AvatarFallback>
					</Avatar>
					<div className="hidden md:flex flex-col items-start gap-0.25 md:in-data-[sidebar-collapsed=true]:hidden">
						<span className="text-sm font-medium text-foreground leading-none">ADP</span>
						<span className="text-xs text-muted-foreground font-normal leading-none">ADP</span>
					</div>
				</div> 
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="!w-56 lg:w-(--radix-dropdown-menu-trigger-width)">
				<DropdownMenuSub>
					<DropdownMenuSubTrigger className="ps-3.5">
						{resolvedTheme === 'light' ? <Sun /> : <Moon />}
						<span className="ps-1.5">
							{resolvedTheme === 'light' ? 'Light' : 'Dark'} Mode
						</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuRadioGroup
							className="w-36"
							value={theme ?? 'system'}
							onValueChange={(v) => setTheme(v as 'light' | 'dark' | 'system')}
						>
							<DropdownMenuRadioItem value="system">
								<Laptop className="mr-2 h-4 w-4" />
								<span>System</span>
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="light">
								<Sun className="mr-2 h-4 w-4" />
								<span>Light</span>
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="dark">
								<Moon className="mr-2 h-4 w-4" />
								<span>Dark</span>
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
			</DropdownMenuContent>
		</DropdownMenu>
  );
}
