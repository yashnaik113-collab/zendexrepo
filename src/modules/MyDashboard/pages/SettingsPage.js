import React from 'react';
import { Box, FormControlLabel, Slider, Stack, Switch, Typography } from '@mui/material';
import { useDashboard } from '../context/DashboardContext';

const SettingsPage = () => {
  const { settings, updateSettings } = useDashboard();

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Settings
      </Typography>
      <Typography sx={{ color: 'rgba(226,232,240,0.72)', mb: 3 }}>
        Tune the chef panel refresh rhythm and dashboard experience for your team.
      </Typography>

      <Stack spacing={2.5}>
        <Box
          sx={{
            p: 2.5,
            borderRadius: 4,
            border: '1px solid rgba(148,163,184,0.16)',
            background: 'rgba(15,23,42,0.72)',
          }}
        >
          <Typography sx={{ fontWeight: 700, mb: 1 }}>Live sync interval</Typography>
          <Typography sx={{ color: 'rgba(226,232,240,0.72)', mb: 2 }}>
            Current interval: {(settings.refreshInterval / 1000).toFixed(0)} seconds
          </Typography>
          <Slider
            min={5000}
            max={30000}
            step={1000}
            value={settings.refreshInterval}
            onChange={(_, value) =>
              updateSettings({ refreshInterval: Array.isArray(value) ? value[0] : value })
            }
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value / 1000}s`}
          />
        </Box>

        <Box
          sx={{
            p: 2.5,
            borderRadius: 4,
            border: '1px solid rgba(148,163,184,0.16)',
            background: 'rgba(15,23,42,0.72)',
          }}
        >
          <Typography sx={{ fontWeight: 700, mb: 1 }}>Experience controls</Typography>
          <FormControlLabel
            control={<Switch checked={settings.soundEnabled} onChange={(event) => updateSettings({ soundEnabled: event.target.checked })} />}
            label="Enable sound-ready setting"
          />
          <FormControlLabel
            control={<Switch checked={settings.compactMode} onChange={(event) => updateSettings({ compactMode: event.target.checked })} />}
            label="Compact dashboard cards"
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default SettingsPage;
