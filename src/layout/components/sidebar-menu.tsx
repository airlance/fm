import { useCallback } from "react";
import { Link, useLocation } from "react-router";
import {
    AccordionMenu,
    AccordionMenuGroup,
    AccordionMenuItem,
} from '@/components/accordion-menu';
import { cn } from "@/lib/utils";
import {
    type LucideIcon,
    LucideInbox,
    Shirt,
    Home,
    Target,
    Users,
    CalendarIcon,
    Search,
    Repeat,
    Trophy,
    Dumbbell
} from "lucide-react";

interface MenuConfig {
    title: string;
    icon?: LucideIcon;
    count?: number;
    path?: string;
    children?: MenuConfig[];
}

const MENU_CONFIG: MenuConfig[] = [
    {
        title: 'Home',
        path: '/home',
        icon: Home,
    },
    {
        title: 'Inbox',
        path: '/inbox',
        icon: LucideInbox,
    },
    {
        title: 'Squad',
        path: '/squad',
        icon: Shirt,
    },
    {
        title: 'Tactics',
        path: '/tactics',
        icon: Target,
    },
    {
        title: 'Staff',
        path: '/staff',
        icon: Users,
    },
    {
        title: 'Training',
        path: '/training',
        icon: Dumbbell,
    },
    {
        title: 'Schedule',
        path: '/schedule',
        icon: CalendarIcon,
    },
    {
        title: 'Competitions',
        path: '/competitions',
        icon: Trophy,
    },
    {
        title: 'Scouting',
        path: '/scouting',
        icon: Search,
    },
    {
        title: 'Transfers',
        path: '/transfers',
        icon: Repeat,
    }
];

export function SidebarMenu() {
    const { pathname } = useLocation();
    const matchPath = useCallback(
        (path: string): boolean =>
            path === pathname || (path.length > 1 && pathname.startsWith(path)),
        [pathname],
    );

    return (
        <AccordionMenu
            selectedValue={pathname}
            matchPath={matchPath}
            type="multiple"
            className="space-y-7.5 in-data-[sidebar-collapsed=true]:flex items-center in-data-[sidebar-collapsed=true]:justify-center"
            classNames={{
                label: 'text-xs font-normal text-muted-foreground',
                item: cn(
                    'flex items-center justify-center h-8 px-2 text-2sm font-normal text-foreground mx-4 in-data-[sidebar-collapsed=true]:mx-0',
                    'hover:text-primary hover:bg-background dark:hover:bg-zinc-900 in-data-[sidebar-collapsed=true]:w-8',
                    'data-[selected=true]:bg-background dark:data-[selected=true]:bg-zinc-900 data-[selected=true]:text-primary [&[data-selected=true]_svg]:opacity-100',
                ),
                group: '',
            }}
        >
            <AccordionMenuGroup>
                {MENU_CONFIG.map((item, index) => {
                    return (
                        <AccordionMenuItem key={index} value={item.path || '#'}>
                            <Link to={item.path || '#'}>
                                {item.icon && <item.icon />}
                                <span className="in-data-[sidebar-collapsed=true]:hidden">{item.title}</span>
                            </Link>
                        </AccordionMenuItem>
                    )
                })}
            </AccordionMenuGroup>
        </AccordionMenu>
    );
}
