import React, { useState, useEffect} from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';

// Modal will pop up only when user creates new graph
const ModalGraphName = (props) => {
    const { authState, setAuthState } = useAuth();
    const [ graphName, setGraphName ] = useState('');
    const { modalVisibility, handleModalClose } = props;

    const handleGraphNameSubmit = async () => {
        // send POST request to server
        console.log('Submitted Graph Name:', graphName);
        const username = authState.username;
        const user_id = authState.user_id;
        const config = {
            headers: { authorization: authState.token },
        }
        const payload = {
            user_id: authState.user_id,
            graphName: graphName
        }

        // hide modal
        handleModalClose();
        // redirect to '/graph/:userId/:graphId'
    }

    const colors = {
        'color-primary': '#C978FB',
        'color-secondary': '#64268A',
        'color-tertiary': '#31AFD4',
        'color-quaternary': '#093758',
        'color-black': '#190624',
        'color-white': '#FCFCFC',
    }

    const theme = createTheme({
        typography: {
            // fontFamily: 'Nunito, Arial, sans-serif',
            fontFamily: 'Nunito',
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#C978FB',
                        fontFamily: 'Outfit',
                        boxShadow: 'none',
                        color: colors['color-white'],
                        marginTop: '1rem',
                        borderRadius: '.4em',
                        textTransform: 'none',
                        fontWeight: 700,
                        letterSpacing: '0.02rem',
                        fontSize: '1rem',
                        transition: 'all 200ms',
                        '&:hover': {
                            transform: 'translateY(-1px)',
                            backgroundColor: '#C978FB',
                            boxShadow: 'none',
                            transition: 'all 200ms'
                        }
                    }
                }
            }
        }
    })

    const boxStyle = {
        backgroundColor: colors['color-white'],
        display: 'flex',
        flexDirection: 'column',
        width: '600px',
        borderRadius: '.4em',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        p: '2rem',
        boxShadow: 8,
    }

    const titleStyle = {
        fontWeight: 500,
        fontSize: '1rem',
    }

    return (
        <ThemeProvider theme={theme}>
            <Modal
                className='modal'
                open={modalVisibility}
                onClose={handleModalClose}
            >
                <Box className='modal-box' sx={boxStyle}>
                    <Typography className='modal-text' sx={titleStyle}>
                        Please enter your new graph name:
                    </Typography>
                    <TextField
                        className='modal-input-field'
                        id='graphName'
                        label='Graph Name'
                        variant='outlined'
                        margin='normal'
                        value={graphName}
                        onChange={(e) => setGraphName(e.target.value)}
                        required
                    />
                    <Button variant='contained' onClick={handleGraphNameSubmit}>Submit</Button>
                </Box>
            </Modal>
        </ThemeProvider>
    )
}

export default ModalGraphName;