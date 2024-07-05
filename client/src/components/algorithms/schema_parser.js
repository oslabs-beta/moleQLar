const pluralize = require('pluralize');
// pluralize.() = plurarizing word
// pluralize.singular() = singularize word

// 1) Find a database to replicate
// 2) Use pg-dump to create an output file
// 3) Build an algorithm to traverse the output file and autobuild our node-graph

// const fs = require("fs");
// const readline = require("readline");

// load schema dump file
// const file_name = "sample_pg_dump.sql";
// const file_path = path.resolve(__dirname, file_name);
// console.log(file_path);

// iterate over file synchronously
// const sqlDump = fs.readFileSync(file_path, "utf-8");

//declare objects to hold tables and relationships
export function parseSqlSchema(sql) {
  const tables = {};
  let currentTable;
  const relationships = [];
  //create mapping object to change SQL types to GQL types
  const typeMapper = {
    varchar: 'String',
    serial: 'ID',
    bigint: 'Int',
    DATE: 'String',
    integer: 'Int',
  };
  // Split dump file into each line
  sql.split(/\r?\n/).forEach((line) => {
    // Add all tables to tables object
    if (line.startsWith('CREATE TABLE')) {
      // Grab table name
      let tableName = line.match(/CREATE TABLE (\w+\.)?(\w+)/)[2];
      //make table name singular and capitalize first letter
      //`    ${pluralize(key)}: [${pluralize.singular(key).replace(/^./, key[0].toUpperCase())}]\n`;

      currentTable = pluralize
        .singular(tableName)
        .replace(/^./, tableName[0].toUpperCase());
      // Add tableName to tables object
      tables[currentTable] = [];
    } else if (line.trim().startsWith('"')) {
      // Add each field to current table
      const lineArray = line.trim().split(' ');
      // Make sure field is valid
      if (lineArray.length >= 2) {
        const fieldName = lineArray[0].replace(/"/g, '');
        //********** can add field mapper here?
        console.log(lineArray[1]);
        //**** remove trailing commas from non-null (required) fields
        const fieldType = typeMapper[lineArray[1].replace(/,/g, '')];
        //********check if length is 4 instead of using includes method? includes method is O(n) for each
        const required = line.toLowerCase().includes('not null');
        // Add new field object to associated fields array on table object
        tables[currentTable].push({
          name: fieldName,
          type: fieldType,
          required: required,
        });
      }
    }
    // Grab relationships from alter tables (primary/foreign keys)
    else if (line.startsWith('ALTER TABLE')) {
      const match = line.match(
        /ALTER TABLE (\w+\.)?(\w+).*FOREIGN KEY \("(\w+)"\) REFERENCES (\w+\.)?(\w+)\("(\w+)"\)/
      );
      if (match) {
        const [, , sourceTable, sourceField, , targetTable, targetField] =
          match;
        relationships.push({
          source: pluralize
            .singular(sourceTable)
            .replace(/^./, sourceTable[0].toUpperCase()),
          sourceHandle: sourceField,
          target: pluralize
            .singular(targetTable)
            .replace(/^./, targetTable[0].toUpperCase()),
          targetHandle: targetField,
        });
      }
    }
  });

  //(1 to 1) (1 to many) (many to 1) and (many to many)
  //from Game (source) node to Review (target) node

  //generate schema from tables object
  //currently correctly adds types and fields with plural/singular form
  //TODO: nested relationships for schema
  //can export when "generate" button functionality exists

  const schemaString = () => {
    let gql_schema = `#graphql\n`;
    let query_string = `  type Query {\n`;
    for (let key in tables) {
      //plural form of type
      query_string += `    ${pluralize(key)}: [${pluralize
        .singular(key)
        .replace(/^./, key[0].toUpperCase())}]\n`;
      //query for one element in type (by ID - singular form)
      query_string += `    ${pluralize.singular(key)}(id: ID!): ${pluralize
        .singular(key)
        .replace(/^./, key[0].toUpperCase())}\n`;

      //two spaces before each type, 4 spaces before each field
      gql_schema += `  type ${pluralize
        .singular(key)
        .replace(/^./, key[0].toUpperCase())} {\n`;
      gql_schema += '    id: ID!\n';

      //for each field in the table except id
      for (let i = 1; i < tables[key].length; i++) {
        const required = tables[key][i].required ? '!' : '';
        gql_schema += `    ${tables[key][i].name}: ${tables[key][i].type}${required}\n`;
      }
      //add nested relationships

      gql_schema += `  }\n`;
    }
    query_string += `  }\n`;
    gql_schema += query_string;
    return gql_schema;
  };

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
    source: rel.source,
    sourceHandle: rel.sourceHandle,
    target: rel.target,
    targetHandle: rel.targetHandle,
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#fff' },
  }));

  //generate graphql schema

  return { nodes, edges, schemaString };
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
