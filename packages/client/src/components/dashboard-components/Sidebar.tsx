import {
    Box,
    Divider,
    List,
    ListItem,
    Typography,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { FormatDate, FullTimeStamp } from '../../utils/DateFormatter';
import { useEffect } from 'react';

const Sidebar = ({ transactionData }) => {
    console.log('transactionData', transactionData);
    useEffect(() => {
        const fetchSme = async () => {
            try {
                const res = await axios.get('http://localhost:3000/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                sessionStorage.setItem('sme-name', res.data.legalName);

                setSmeId(res.data.id);
            } catch (error) {
                console.log(error);
            }
        };
        fetchSme();
    }, []);

    return (
        <Box sx={{ width: 250 }} role="presentation">
            <List>
                {/* <ListItem>{transactionData.userId}</ListItem>
                <Typography>
                    {FullTimeStamp(transactionData.transactionTime)}
                </Typography> */}
                <ListItem>
                    <ListItemText
                        primary="Timestamp"
                        secondary={FullTimeStamp(
                            transactionData.transactionTime
                        )}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Status"
                        secondary={transactionData.status}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="User"
                        secondary={sessionStorage.getItem('email')}
                    />
                </ListItem>
            </List>
            <Divider />
        </Box>
    );
};

export { Sidebar };
