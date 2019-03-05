import React, { useCallback, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PrimaryButton from '../PrimaryButton/PrimaryButton';

function DisplayMarker(props) {
  const { label, summary } = props.marker;
  return (
    <CardContent>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="title" component="h3">
            {label || 'Unnamed range'}
          </Typography>
        </Grid>
        <Grid>
          <IconButton onClick={props.onEdit} style={{ padding: 5 }}>
            <Edit fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>

      <Typography variant="subtitle1">
        {summary || (
          <span style={{ color: '#999' }}>This annotation has no summary</span>
        )}
      </Typography>
    </CardContent>
  );
}

function CustomTextField(props) {
  return (
    <TextField
      autoFocus={true}
      InputLabelProps={{
        shrink: true,
      }}
      fullWidth
      margin="normal"
      {...props}
    />
  );
}

function EditMarker(props) {
  const [draft, setDraft] = useState(() => ({
    label: props.marker.label,
    summary: props.marker.summary,
  }));

  const onSave = useCallback(() => props.onSave(draft), [draft]);

  const handleKeyDown = useCallback(
    e => {
      if (e.target && e.target.tagName === 'TEXTAREA') {
        return;
      }
      if (e.keyCode === 13) {
        onSave();
      }
      if (e.keyCode === 27) {
        props.onCancel();
      }
    },
    [draft, onSave]
  );

  const updateDraftField = (name, type) => event =>
    setDraft({
      ...draft,
      [name]: type === 'checkbox' ? event.target.checked : event.target.value,
    });

  return (
    <form style={{ padding: 20 }} onKeyDown={handleKeyDown}>
      <CustomTextField
        id="label"
        label="Label"
        placeholder="Unnamed range"
        value={draft.label}
        onChange={updateDraftField('label')}
      />
      <CustomTextField
        id="summary"
        name="summary"
        label="Description"
        placeholder="Marker description"
        multiline={true}
        value={draft.summary}
        onChange={updateDraftField('summary')}
      />
      <Grid
        container
        spacing={16}
        direction="row"
        justify="flex-start"
        alignItems="center"
      >
        <Grid
          item
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flex: 1,
          }}
        >
          <Button onClick={props.onCancel}>Cancel</Button>
          <PrimaryButton disabled={!props.onSave} onClick={onSave}>
            Save
          </PrimaryButton>
        </Grid>
      </Grid>
    </form>
  );
}

export default function MarkerMetadata(props) {
  const [isEditing, setIsEditing] = useState();
  const { marker, onSaveMarker } = props;

  return (
    <Card
      style={{
        borderLeft: `4px solid ${props.colour}`,
        marginLeft: `${props.inset * 24}px`,
        marginBottom: 16,
      }}
    >
      {isEditing ? (
        <EditMarker
          marker={marker}
          onSave={draft => {
            onSaveMarker(draft);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <DisplayMarker marker={marker} onEdit={() => setIsEditing(true)} />
      )}
    </Card>
  );
}
