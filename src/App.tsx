import { ThemeProvider } from 'next-themes';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ModuleProvider } from "./providers/module-provider";
import { LoadingBarContainer } from 'react-top-loading-bar';
import { Toaster } from '@/components/sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import DayTransitionModule from './modules/day-transition/index';
import useDatabaseSync from '../db/useDatabaseSync';
// import RouterProvider from './providers/RouterProvider';

const { BASE_URL } = import.meta.env;

export default function App() {
    const isDatabaseReady = useDatabaseSync();

    if (!isDatabaseReady) {
        return <div>Initializing database...</div>;
    }

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            storageKey="vite-theme"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
        >
            <HelmetProvider>
                <LoadingBarContainer>
                    <BrowserRouter basename={BASE_URL}>
                        {/*<RouterProvider >*/}
                            <QueryClientProvider client={queryClient}>
                                <Toaster />
                                <DayTransitionModule />
                                <ModuleProvider />
                            </QueryClientProvider>
                        {/*</RouterProvider>*/}
                    </BrowserRouter>
                </LoadingBarContainer>
            </HelmetProvider>
        </ThemeProvider>
    )
}
