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

const Sidebar = ({ transactionData, user }) => {
    // console.log('transactionData', transactionData);

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
                    <ListItemText primary="User" secondary={user} />
                </ListItem>
            </List>
            <Divider />
        </Box>
    );
};

export { Sidebar };
