import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

interface IHeader {
    handleLogout?: () => void;
}

const Header = ({ handleLogout }: IHeader) => {
    const userEmail = sessionStorage.getItem('email');
    const smeName = sessionStorage.getItem('sme-name');

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography component="div" sx={{ flexGrow: 1 }}>
                        {userEmail}
                    </Typography>
                    <Typography component="div" sx={{ flexGrow: 1 }}>
                        {smeName}
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;
