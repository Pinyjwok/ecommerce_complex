import { Box, Button, Flex, Spacer } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { isAuthenticated, logout } from '../services/auth';
import { useNavigate } from 'react-router-dom';

console.log('Navigation component loaded');

export default function Navigation() {
    const navigate = useNavigate();
    const authenticated = isAuthenticated();
    console.log('Navigation rendered', { authenticated });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box bg="gray.100" px={4} py={2}>
            <Flex alignItems="center">
                <Box>
                    <Button as={RouterLink} to="/" variant="ghost" mr={2}>
                        Home
                    </Button>
                </Box>
                <Spacer />
                <Box>
                    {authenticated ? (
                        <Button onClick={handleLogout} colorScheme="red">
                            Logout
                        </Button>
                    ) : (
                        <>
                            <Button as={RouterLink} to="/login" colorScheme="blue" mr={2}>
                                Login
                            </Button>
                            <Button as={RouterLink} to="/register" colorScheme="green">
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Flex>
        </Box>
    );
}
