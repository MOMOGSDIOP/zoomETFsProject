import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

export default function ETFPositions({ positions }) {
  return (
    <>
      <Typography variant="h6">Top positions</Typography>
      <List>
        {positions.topAssets.map((pos, i) => (
          <ListItem key={i}>
            <ListItemText primary={`${pos.name} - ${pos.percentage}%`} />
          </ListItem>
        ))}
      </List>
      <Typography variant="h6">Répartition par pays</Typography>
      <List>
        {positions.byCountry.map((pos, i) => (
          <ListItem key={i}>
            <ListItemText primary={`${pos.country} - ${pos.percentage}%`} />
          </ListItem>
        ))}
      </List>
      <Typography variant="h6">Répartition par secteur</Typography>
      <List>
        {positions.bySector.map((pos, i) => (
          <ListItem key={i}>
            <ListItemText primary={`${pos.sector} - ${pos.percentage}%`} />
          </ListItem>
        ))}
      </List>
    </>
  );
}
