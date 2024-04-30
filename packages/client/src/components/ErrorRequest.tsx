import { Alert, Card, CardContent, Typography } from '@mui/material';
import { useContext } from 'react';
import { ErrorContext } from '../context/context';

const ErrorRequest = () => {
    const { errorMessage } = useContext(ErrorContext);

    return (
        <Card
            style={{
                display: 'flex',
                flexGrow: '1',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <CardContent>
                <Typography variant="h4">
                    There is an issue with your request, try again
                </Typography>
                <Alert severity="error">{errorMessage}</Alert>
            </CardContent>
        </Card>
    );
};

export default ErrorRequest;
