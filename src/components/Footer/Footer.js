import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import './Footer.scss';

const Footer = () => (
  <Grid container className="footer">
    <Grid item xs={6}>
      <Typography variant="body1">&copy; Indiana University, 2018</Typography>
    </Grid>
    <Grid
      item
      xs={6}
      style={{
        textAlign: 'right',
      }}
    >
      <Typography variant="body1">About Timeliner | Help | Contact</Typography>
    </Grid>
  </Grid>
);

export default Footer;
