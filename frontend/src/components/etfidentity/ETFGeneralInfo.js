import React from 'react';
import { Typography, Grid } from '@mui/material';

export default function ETFGeneralInfo({ data }) {
  return (
    <Grid container spacing={2}>
      {Object.entries(data).map(([key, value]) => (
        <Grid item xs={12} sm={6} key={key}>
          <Typography><strong>{key.replace(/([A-Z])/g, ' $1')} :</strong> {value}</Typography>
        </Grid>
      ))}
    </Grid>
  );
}
