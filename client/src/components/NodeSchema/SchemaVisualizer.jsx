import axios from 'axios';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  getBezierPath,
  Handle,
  Position,
} from 'reactflow';
import { parseSqlSchema } from '../algorithms/schema_parser';
import NodeList from './NodeList';
import './schemavisualizer.scss'; // styles
import GenerateTab from '../GenerateTabs/genTab';
import { useTheme } from '../../contexts/ThemeContext';

import { useAuth } from '../../contexts/AuthContext';
import { useGraphContext } from '../../contexts/GraphContext';

// Custom node component for representing database tables
// Memoized for performance optimization in large graphs
const TableNode = React.memo(({ data, id, selected }) => (
  <div
    style={{
      padding: '10px',
      border: `2px solid ${selected ? '#ff00ff' : '#555'}`,
      borderRadius: '5px',
      background: '#333',
      color: '#fff',
      cursor: 'move',
      userSelect: 'none',
      fontSize: '12px',
      position: 'relative',
    }}
  >
    <div
      style={{
        fontWeight: 'bold',
        borderBottom: '1px solid #555',
        marginBottom: '5px',
        color: '#3a8',
      }}
    >
      {data.label}
    </div>
    {data.columns &&
      data.columns.fields &&
      data.columns.fields.map((col, index) => (
        <div key={index}>
          <Handle
            type='source'
            position={Position.Right}
            id={col.name}
            style={{ background: '#555' }}
          />
          <Handle
            type='target'
            position={Position.Left}
            id={col.name}
            style={{ background: '#555' }}
          />
          <span style={{ color: '#6bf' }}>{col.name}</span>
          <span style={{ color: '#f86' }}>({col.type})</span>
          {col.required && <span style={{ color: '#fc6' }}> NOT NULL</span>}
        </div>
      ))}
  </div>
));

const colorScheme = [
  '#ff6b6b',
  '#4ecdc4',
  '#45aaf2',
  '#feca57',
  '#a55eea',
  '#ff9ff3',
  '#54a0ff',
  '#5f27cd',
  '#48dbfb',
  '#ff9ff3',
];

// Custom edge component to visualize relationships between tables
// Allows for custom styling and labels on edges
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={{
          stroke: data.color,
          strokeWidth: 2,
          opacity: data.hidden ? 0.1 : 1,
        }}
        className='react-flow__edge-path'
        d={edgePath}
      />
      <text>
        <textPath
          href={`#${id}`}
          style={{
            fontSize: '12px',
            fill: data.color,
            opacity: data.hidden ? 0.1 : 1,
          }}
          startOffset='50%'
          textAnchor='middle'
        >
          {data.label}
        </textPath>
      </text>
    </>
  );
};

const nodeTypes = {
  table: TableNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

// Main component for visualizing and editing database schemas
const SchemaVisualizer = ({ sqlContents, handleUploadBtn }) => {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [focusMode, setFocusMode] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { darkMode } = useTheme();

  // TODO - send request to server to request graph_name, graph_id, nodes_string, edges_string
  const { username } = useAuth();
  const { graphName, setGraphName } = useGraphContext();
  // const { graphId, setGraphId } = useGraphContext();  -- to be managed as URL param
  // get URL params
  const { userId, graphId } = useParams();

  // Fetch graph data from the server on component mount
  // This allows for persistent storage and retrieval of user's graph data
  useEffect(() => {
    const fetchGraphData = async () => {
      // fetch from server
      // console.log(`/graph/${userId}/${graphId}`);
      const config = {
        headers: { authorization: localStorage.getItem('token') },
      };
      try {
        // GET from server
        const response = await axios.get(
          `/api/graph/${userId}/${graphId}`,
          config
        );
        let serverNodes, serverEdges;
        response.data.nodes === ''
          ? (serverNodes = [])
          : (serverNodes = JSON.parse(response.data.nodes));
        response.data.edges === ''
          ? (serverEdges = [])
          : (serverEdges = JSON.parse(response.data.edges));

        setGraphName(response.data.graphName);
        setNodes(serverNodes);
        setEdges(serverEdges);
      } catch (err) {
        if (err.response) {
          // fail - unable to log in
          // request made, server responded with status code outside of 2xx range
          console.log(
            'Failed to pull graph. Error response data:',
            err.response.data
          );
          console.log(
            'Failed to pull graph. Error response status:',
            err.response.status
          );
        } else if (err.request) {
          console.log('Error request:', err.request);
        } else {
          console.log('Error message:', err.message);
        }
        navigate('/dashboard');
      }
    };
    fetchGraphData();
  }, []);

  // Save the current graph state to the server
  // This function is called when the user clicks the save button
  // Allows for persistence of user's work across sessions
  const handleSaveBtn = async () => {
    // save functionality
    // convert nodes and edges to string
    const nodeString = JSON.stringify(nodes);
    const edgeString = JSON.stringify(edges);

    // console.log('nodes:', nodeString)
    // console.log('edges:', edgeString)
    console.log('userId:', userId);
    console.log('graphName:', graphName);

    // send POST request to /api/graph/:userId/:graphId
    const config = {
      headers: { authorization: localStorage.getItem('token') },
    };
    const payload = {
      username: username,
      userId: userId,
      graphName: graphName,
      graphId: graphId,
      nodes: nodeString,
      edges: edgeString,
    };
    try {
      const response = await axios.put(
        `/api/graph/${userId}/${graphId}`,
        payload,
        config
      );
      // success
      console.log('Successfully saved node graph to database');
      console.log('response:', response);
    } catch (err) {
      if (err.response) {
        // request made, server responded with status code outside of 2xx range
        console.log('Failed ot save graph data:', err.respones.data);
        console.log('Failed ot save graph status:', err.respones.status);
      } else if (err.request) {
        console.log('Error request:', err.request);
      } else {
        console.log('Error message:', err.message);
      }
    }
  };

  // Toggle the generation tab visibility
  // This function is called when the user clicks the generate button
  // Separates the graph visualization from code generation for a cleaner UI
  const [genTabOpen, setGenTabOpen] = useState(false);
  const handleGenTabOpen = () => {
    console.log('clicked generate button');
    setGenTabOpen((prev) => !prev);
    console.log('genTabOpen', genTabOpen);
  };
  const handleGenTabClose = () => {
    setGenTabOpen(false);
  };

  // Remove a node from the graph and clean up related edges
  // This function ensures graph consistency when deleting nodes
  const deleteNode = useCallback(
    (id) => {
      setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
      setEdges((prevEdges) =>
        prevEdges.filter((edge) => edge.source !== id && edge.target !== id)
      );
      if (selectedNode === id) {
        setSelectedNode(null);
        setFocusMode(false);
      }
    },
    [setNodes, setEdges, selectedNode]
  );

  // Select a node and focus the view on it
  // This function enhances user experience by highlighting the selected node
  // and its immediate relationships
  const selectNode = useCallback(
    (id) => {
      setSelectedNode(id);
      setFocusMode(true);
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          selected: node.id === id,
        }))
      );
      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          data: {
            ...edge.data,
            hidden: !(edge.source === id || edge.target === id),
          },
        }))
      );
      if (reactFlowInstance) {
        const node = nodes.find((n) => n.id === id);
        if (node) {
          reactFlowInstance.setCenter(node.position.x, node.position.y, {
            duration: 800,
            zoom: 1.2,
          });
        }
      }
    },
    [setNodes, setEdges, nodes, reactFlowInstance]
  );

  // Add a new node to the graph
  // This function is used when the user wants to manually add a new table
  const addNode = useCallback(
    (newNode) => {
      const nodeId = `table-${nodes.length + 1}`;
      const position = { x: 0, y: 0 };
      if (reactFlowInstance) {
        const { x, y } = reactFlowInstance.project({ x: 100, y: 100 });
        position.x = x;
        position.y = y;
      }

      const newTableNode = {
        id: nodeId,
        type: 'table',
        position,
        data: {
          label: newNode.name,
          columns: {
            fields: newNode.fields.map((field) => ({
              name: field.name,
              type: field.type,
              required: field.required,
            })),
          },
        },
      };

      setNodes((nds) => [...nds, newTableNode]);
    },
    [nodes, reactFlowInstance, setNodes]
  );

  // Edit an existing node in the graph
  // This function allows users to modify table structures after initial creation
  const editNode = useCallback(
    (nodeId, updatedNode) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  label: updatedNode.name,
                  columns: {
                    fields: updatedNode.fields.map((field) => ({
                      name: field.name,
                      type: field.type,
                      required: field.required,
                    })),
                  },
                },
              }
            : node
        )
      );
    },
    [setNodes]
  );

  // Parse SQL contents and update the graph
  // This effect runs when new SQL content is uploaded, automating the graph creation process
  useEffect(() => {
    if (sqlContents.length > 0) {
      const { nodes: newNodes, edges: newEdges } = parseSqlSchema(
        sqlContents[sqlContents.length - 1]
      );

      const coloredEdges = newEdges.map((edge, index) => ({
        ...edge,
        type: 'custom',
        data: {
          color: colorScheme[index % colorScheme.length],
          label: `${edge.sourceHandle} → ${edge.targetHandle}`,
          hidden: false,
        },
        style: { stroke: colorScheme[index % colorScheme.length] },
      }));

      setNodes(newNodes);
      setEdges(coloredEdges);

      if (reactFlowInstance) {
        setTimeout(() => {
          reactFlowInstance.fitView({ padding: 0.1, includeHiddenNodes: true });
        }, 100);
      }
    }
  }, [sqlContents, setNodes, setEdges, reactFlowInstance]);

  console.log('Testnodes', nodes);
  // Render the schema visualizer component
  // This includes the node list, graph area, and generation tab
  return (
    <div className='schema-visualizer'>
      <GenerateTab
        open={genTabOpen}
        onClose={handleGenTabClose}
        nodes={nodes}
        edges={edges}
      />
      <NodeList
        tables={nodes}
        onSelectTable={selectNode}
        onDeleteTable={deleteNode}
        onAddNode={addNode}
        onEditNode={editNode}
        selectedTableId={selectedNode}
      />
      <ReactFlowProvider>
        <div
          className={`node-graph-container ${darkMode ? 'dark' : ''}`}
          ref={reactFlowWrapper}
        >
          <div className='graph-btn-container'>
            <button
              className='btn-generate btn-graph'
              onClick={handleGenTabOpen}
              disabled={!reactFlowInstance}
            >
              Generate
            </button>
            <button className='btn-save btn-graph' onClick={handleSaveBtn}>
              Save
            </button>
          </div>

          <ReactFlow
            className={`node-graph ${darkMode ? 'dark' : ''}`}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            style={{ background: darkMode ? '#1a1a1a' : '#ffffff' }}
            onNodeClick={(event, node) => selectNode(node.id)}
            onInit={setReactFlowInstance}
          >
            <Background color={darkMode ? '#333' : '#aaa'} gap={16} />
            <Controls
              style={{
                background: darkMode ? '#333' : '#fff',
                color: darkMode ? '#fff' : '#000',
                border: 'none',
              }}
            />
            <MiniMap
              style={{
                background: darkMode ? '#333' : '#f0f0f0',
                maskColor: darkMode ? '#666' : '#ccc',
              }}
              nodeColor={darkMode ? '#666' : '#ccc'}
            />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default SchemaVisualizer;
