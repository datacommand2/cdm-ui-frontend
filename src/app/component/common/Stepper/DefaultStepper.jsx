import { Box, Step, StepLabel, Stepper } from '@mui/material';
import React from 'react';
// import './stepper.scss';

const DefaultStepper = ({ step, stepLength }) => {
    const steps = new Array(stepLength).fill('');

    if (step === '') {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Stepper
                    alternativeLabel
                    style={{
                        paddingBottom: '0',
                        paddingRight: '6px',
                        float: 'right',
                    }}
                >
                    {steps.map((label, idx) => (
                        <Step key={`${label}_${idx}`} active={true}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        );
    } else {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Stepper
                    activeStep={step}
                    alternativeLabel
                    style={{
                        paddingBottom: '0',
                        paddingRight: '6px',
                        float: 'right',
                    }}
                >
                    {steps.map((label, idx) => (
                        <Step key={`${label}_${idx}`}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        );
    }
};

export default DefaultStepper;
