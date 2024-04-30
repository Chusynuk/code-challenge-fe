import { Box, Grid } from '@mui/material';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorContext } from '../context/context';
import { ErrorRequest, Header } from './';

interface ILayout {
    children: React.ReactNode;
    handleLogout?: () => void;
}

const Layout = ({ handleLogout, children }: ILayout) => {
    const location = useLocation();
    const { hasError } = useContext(ErrorContext);
    const isDashboardPage = location.pathname.includes('dashboard');

    return (
        <>
            <Grid
                container
                display="flex"
                flexGrow="1"
                flexDirection="column"
                minHeight="95vh"
            >
                {isDashboardPage && <Header handleLogout={handleLogout} />}

                {!hasError ? (
                    <Grid flexGrow="1" alignItems="center">
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            component="section"
                            height="100%"
                            sx={{ p: 2, border: '1px solid grey' }}
                        >
                            {children}
                        </Box>
                    </Grid>
                ) : (
                    <ErrorRequest />
                )}
            </Grid>
        </>
    );
};

export default Layout;
