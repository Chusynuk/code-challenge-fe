import { Box, Typography } from '@mui/material';

const ErrorRequest = () => {
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
        </Box>
    );
};

export default ErrorRequest;
