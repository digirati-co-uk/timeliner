import React from 'react';
import MaterialTable from 'material-table';

export default function MarkersMetadata(props) {
  const {
    markers,
    onSaveMarker,
    onDeleteMarker,
    onGoToMarker,
  } = props;

  const [state, setState] = React.useState({
    columns: [
      { title: 'Text', field: 'label', editable: 'onUpdate' },
      { title: 'Type', field: 'summary', editable: 'onUpdate' },
      { title: 'Start Time', field: 'time', editable: 'never' },
    ],
    data: [
      { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
      {
        name: 'Zerya Betül',
        surname: 'Baran',
        birthYear: 2017,
        birthCity: 34,
      },
    ],
  });

  return (
    <MaterialTable
      title="Name Entities"
      columns={state.columns}
      data={state.data}
      editable={{
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
              if (oldData) {
                setState((prevState) => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.splice(data.indexOf(oldData), 1);
                return { ...prevState, data };
              });
            }, 600);
          }),
	  }}
	  options={{
        sorting: true
	  }}
	  actions={[
		{
		  icon: 'save',
		  tooltip: 'Save User',
		  onClick: (event, rowData) => {
			
		}
		}
	]}
    />
  );
}