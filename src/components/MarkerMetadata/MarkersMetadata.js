/* eslint-disable prettier/prettier */
import React from 'react';
import formatDate from 'date-fns/format';
import MaterialTable from 'material-table';
import ArrowForward from '@material-ui/icons/ArrowForward';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const { forwardRef } = React;

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
    GotoArrow: forwardRef((props, ref) => <ArrowForward {...props} ref={ref} color='action' />),
  };


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
    { title: 'Start Time', field: 'time', editable: 'never', render: rowData => timeToLabel(rowData.time) },
  ]);

  const [data, setData] = useState(markers);

  const timeToLabel = timeOffset => {
    if (timeOffset < 0) {
      return this.timeToLabel(0);
    }
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const date = new Date(timeOffset + timezoneOffset);
    if (date.toString() === 'Invalid Date') {
      return 'Invalid time';
    }
    const format = timeOffset >= 3600000 ? 'hh:mm:ss.SS' : 'mm:ss.SS';
    return formatDate(date, format);
  };

  return (
    <MaterialTable
      icons={tableIcons}
      title="Named Entities"
      columns={columns}
      data={markers}
      options={{
          sorting: true,
          actionsColumnIndex: -1
      }}
      actions={[
        {
          icon: () => <ArrowForward />,
          tooltip: 'Go To Marker',
          onClick: (event, rowData) => {
            onGoToMarker(rowData)
          }
        }
      ]}      
      editable={{
        // onRowAdd: (newData) =>
        //   new Promise((resolve, reject) => {
        //     setTimeout(() => {
        //       onSaveMarker(newData);
        //       setData([...markers]);
        //       resolve();
        //     }, 1000)
        //   }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              onSaveMarker(oldData, newData);
              setData([...markers]);
              resolve();
            }, 1000)
          }),
        onRowDelete: oldData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              onDeleteMarker(oldData);
              setData([...markers]);
              resolve()
            }, 1000)
          }),
	    }}
    />
  );
}
