import { Box, Typography } from '@mui/material';
import { ErrorContext } from '../context/context';
import { useContext } from 'react';

const ErrorRequest = () => {
    const { errorMessage } = useContext(ErrorContext);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            height="100%"
        >
            <Typography variant="h4">
                There is an issue with your request, try again
            </Typography>
            <Typography variant="body1">{errorMessage}</Typography>
        </Box>
    );
};

export default ErrorRequest;
