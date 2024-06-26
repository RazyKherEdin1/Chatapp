import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React, { useState } from "react";

function Navbar() {
    const [anchorElNav, setAnchorElNav] = useState();
    const [anchorElUser, setAnchorElUser] = useState();
    const pages = ['Chat', 'Drone'];

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location = '/';
    };

    return (
        <AppBar position="static" sx={{marginBottom: 2}}> {/*TODO: center that*/} {/*, width: '70%'*/}
          <Container maxWidth="xl">
            <Toolbar disableGutters>    
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    href={page}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
    
              <Box sx={{ flexGrow: 0 }}>
              <Button sx={{ color: 'black' }} onClick={handleLogout}>
              Logout
            </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      );
    };

export default Navbar;