// 1) Find a database to replicate
// 2) Use pg-dump to create an output file
// 3) Build an algorithm to traverse the output file and autobuild our node-graph

const fs = require('fs');
const readline = require('readline');

// load schema dump file
const file_name = 'sample_pg_dump.sql';
const file_path = path.resolve(__dirname, file_name);
console.log(file_path);

// iterate over file synchronously
const sqlDump = fs.readFileSync(file_path, 'utf-8');

//declare objects to hold tables and relationships
const tables = {};
let currentTable;
const relationships = {};

//split dump file into each line
sqlDump.split(/\r?\n/).forEach((line) => {
  //add all tables to tables object
  if (line.startsWith('CREATE TABLE')) {
    //grab table name
    let tableName = line.substring(20, line.length - 2);
    currentTable = tableName;
    //add tableName to tables object
    tables[currentTable] = [];
  } else if (line.startsWith('\t')) {
    //add each field to current table
    lineArray = line.split(' ');
    //make sure field is valid
    if (lineArray.length < 5) {
      const fieldName = lineArray[0].substring(2, lineArray[0].length - 1);
      const fieldType = lineArray[1];
      const required = lineArray.length === 4;
      //add new field object to associated fields array on table object
      tables[currentTable].push({
        name: fieldName,
        type: fieldType,
        required: required,
      });
    }
  }
  //grab relationships from alter tables (primary/foreign keys)
  else if (line.startsWith('ALTER TABLE')) {
    lineArray = line.split(' ');
    //target main table and main table field for relationship
    const mainTable = lineArray[2].substring(7);
    const mainTableField = lineArray[8].substring(2, lineArray[8].length - 2);

    const openParenIndex = lineArray[10].indexOf('(');
    //target secondary table and secondary table field for relationship
    const secondaryTable = lineArray[10].substring(7, openParenIndex);
    const secondaryTableField = lineArray[10].substring(
      openParenIndex + 2,
      lineArray[10].length - 3
    );
    //add link onto relationships object
    relationships[mainTable] = secondaryTable;
  }
});

console.log(tables);
console.log(relationships);

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
