import { Helmet } from 'react-helmet-async';
import { Wrapper } from './components/wrapper';
import { LayoutProvider } from './components/context';

export function Layout() {

    return (
        <>
            <Helmet>
                <title>Layout 26</title>
            </Helmet>

            <LayoutProvider
                bodyClassName="bg-zinc-100 dark:bg-zinc-900 lg:overflow-hidden"
                style={{
                    '--sidebar-width': '10px',
                    '--aside-width': '10px',
                } as React.CSSProperties}
            >
                <Wrapper />
            </LayoutProvider>
        </>
    );
}
