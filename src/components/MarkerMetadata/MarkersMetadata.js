/* eslint-disable prettier/prettier */
import React from 'react';
import MaterialTable from 'material-table';
import ArrowForward from '@material-ui/icons/ArrowForward';


export default function MarkersMetadata(props) {
  const {
    markers,
    onSaveMarker,
    onDeleteMarker,
    onGoToMarker,
  } = props;

  const { useState } = React;

  const [columns, setColumns] = useState([
    { title: 'Text', field: 'label', editable: 'onUpdate' },
    { title: 'Type', field: 'summary', editable: 'onUpdate' },
    { title: 'Start Time', field: 'time', editable: 'never' },
  ]);

  const [data, setData] = useState(props.markers);

  return (
    <MaterialTable
      title="Markers for Named Entities"
      columns={columns}
      data={data}
      editable={{
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataUpdate = [...data];
              // const index = oldData.tableData.id;
			        // dataUpdate[index] = newData;
              oldData.label = newData.label;
              oldData.summary = newData.summary;			  
              dataUpdate[index] = oldData;
              setData([...dataUpdate]);
              onSaveMarker(oldData, newData);
              resolve();
            }, 1000)
          }),
        onRowDelete: oldData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataDelete = [...data];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              setData([...dataDelete]);
              onDeleteMarker(oldData.id);
              resolve()
            }, 1000)
          }),
	    }}
      options={{
          sorting: true
      }}
      actions={[
        {
          icon: 'arrow',
          tooltip: 'Go To Marker',
          onClick: (event, rowData) => {
            onGoToMarker(rowData)
          }
        }
      ]}
    />
  );
}
