import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

export default function ETFExchanges({ exchanges }) {
  return (
    <>
      <Typography variant="h6">Bourses de cotation</Typography>
      <List>
        {exchanges.map((exchange, i) => (
          <ListItem key={i}>
            <ListItemText primary={`${exchange.name} - ${exchange.open} à ${exchange.close}`} />
          </ListItem>
        ))}
      </List>
    </>
  );
}
