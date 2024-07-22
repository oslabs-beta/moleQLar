const pluralize = require('pluralize');
// pluralize.() = plurarizing word
// pluralize.singular() = singularize word

// 1) Find a database to replicate
// 2) Use pg-dump to create an output file
// 3) Build an algorithm to traverse the output file and autobuild our node-graph

// load schema dump file

export function parseSqlSchema(sql) {
  //declare objects to hold tables and relationships
  const tables = {};
  let currentTable;
  const relationships = [];
  let index = 0;
  //moreFields handles adding fields to GQL types
  let moreFields = false;
  //create mapping object to change SQL types to GQL types
  const typeMapper = {
    varchar: 'String',
    serial: 'ID',
    bigint: 'Int',
    DATE: 'String',
    integer: 'Int',
    character: 'String',
  };

  const lineArray = sql.split(/\r?\n/);

  // Split dump file into each line
  lineArray.forEach((line) => {
    // Add all tables to tables object
    if (line.startsWith('CREATE TABLE public')) {
      // Grab table name
      let tableName = line.match(/CREATE TABLE (\w+\.)?(\w+)/)[2];
      currentTable = tableName;
      // Add tableName to tables object
      tables[currentTable] = [];
      moreFields = true;
    } else if (moreFields) {
      if (line.startsWith(')')) {
        //if all fields have been added to table, set moreFields to false
        moreFields = false;
      } else {
        // Add each field to current table
        const lineArray = line.trim().split(' ');
        // Make sure field is valid
        if (lineArray.length >= 2) {
          const fieldName = lineArray[0].replace(/"/g, '');
          //make sure field is not a primary key definition
          if (fieldName !== 'CONSTRAINT') {
            //remove trailing commas from non-null (required) fields to check if required
            const fieldType = typeMapper[lineArray[1].replace(/,/g, '')];
            const required = line.toLowerCase().includes('not null');
            // Add new field object to associated fields array on table object
            tables[currentTable].push({
              name: fieldName,
              type: fieldType,
              required: required,
            });
          }
        }
      }
    }
    // Grab relationships from alter tables (primary/foreign keys)
    else if (line.startsWith('ALTER TABLE')) {
      //standardize input
      line = line.replace('ALTER TABLE ONLY', 'ALTER TABLE').replace(/"/g, '');
      //only use public tables to link relationships
      if (line.startsWith('ALTER TABLE public')) {
        //if line has been split into two lines on import, concatenate them
        if (line.at(line.length - 1) !== ';') {
          //add next line to current
          line += lineArray[index + 1];
        }
        //attempt to match line to template
        const match = line.match(
          /ALTER TABLE (\w+\.)?(\w+).*FOREIGN KEY \((\w+)\) REFERENCES (\w+\.)?(\w+)\((\w+)\)/
        );
        //if line matches, store data
        if (match) {
          const [
            ,
            sourceCheck,
            sourceTable,
            sourceField,
            targetCheck,
            targetTable,
            targetField,
          ] = match;

          //if both tables are public, push data onto relationships object
          if (sourceCheck === 'public.' && targetCheck === 'public.') {
            relationships.push({
              source: sourceTable,
              sourceHandle: sourceField,
              target: targetTable,
              targetHandle: targetField,
            });
          }
        }
      }
    }
    index++;
  });

  // Calculate grid layout
  const gridLayout = (nodes, columns = 3, width = 250, height = 300) => {
    return nodes.map((node, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      return {
        ...node,
        position: {
          x: column * width,
          y: row * height,
        },
      };
    });
  };

  // Create nodes for React Flow
  const nodes = gridLayout(
    Object.entries(tables).map(([tableName, columns]) => ({
      //changed tableName to this
      id: pluralize
        .singular(tableName)
        .replace(/^./, tableName[0].toUpperCase()),
      type: 'table',
      //added sqlTableName
      dbTableName: tableName,
      data: {
        //changed tableName to this
        label: pluralize
          .singular(tableName)
          .replace(/^./, tableName[0].toUpperCase()),
        columns: columns,
      },
    }))
  );

  // Create edges for React Flow
  const edges = relationships.map((rel, index) => ({
    id: `e${index}`,
    source: pluralize
      .singular(rel.source)
      .replace(/^./, rel.source[0].toUpperCase()),
    sourceHandle: rel.sourceHandle,
    dbSourceTable: rel.source,
    target: pluralize
      .singular(rel.target)
      .replace(/^./, rel.target[0].toUpperCase()),
    targetHandle: rel.targetHandle,
    dbTargetTable: rel.target,
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#fff' },
  }));

  return { nodes, edges };
}

//{name: "name, type: "type", required: }
//types in GraphQL : String, Int, Float, Boolean, ID, and []

//varchar -> String
//bigInt -> Int
//serial -> ID

//people -> planets

// type Person{
//   _id: type,
//   name: type,
//   planets: [Planet!]
// }

// find 'CREATE TABLE' statements
//create new instance of Table class
//loop through fields in table
//for each field create new instance of column and add each to parent table's columns property

//for 'ALTER TABLE' statements
//ALTER TABLE ONLY public.species_in_films ADD CONSTRAINT species_in_films_fk1 FOREIGN KEY (species_id) REFERENCES public.species(_id);
//ALTER TABLE ONLY public.species ADD CONSTRAINT species_fk0 FOREIGN KEY (homeworld_id) REFERENCES public.planets(_id);

//let ref_table_name = 'planets'
//let ref_table = tables.find((table) => table.name = ref_table_name)

//table.assign_foreign_key('homeworld_id', ref_table='planets')

//currTable[col]

// currTable.columns.push(
//     new Column(name='species_fk0', is_primary_key=false, ref_table=ref_table)
// )
//for the table specified after public - get foreign key and save link to referenced column in other table

// invoke createNode() function to create a table node in node graph for each table

// invoke addField() function on table node component to add a field property
