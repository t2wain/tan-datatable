## Introduction

This is a sample DataTable.net React component to display data in a table. This is a feature extracted from an application I developed. I have also refactored the code so that it can be reused more easily.  The basic usage is follow:

```JSX
<TNDataTable {...{ tblData, colDefs, order }} />
```

- tblData - an array of json objects. Note, the table will be updated when data changed.
- colDefs - an array of column config per DataTable.net. Note, if the column has a css class *.select-filter*, a dropdown filter will be setup for that column.
- order - an array of default sort columns per DataTable.net

All the code calling the DataTable.net api is extracted to a separate module since it is manipulating the DOM outside of React.  

## React Custom Hook

The custom hook *useData* can assist with making an async method call (such as to retrieve data) while providing a loading status and a display message.