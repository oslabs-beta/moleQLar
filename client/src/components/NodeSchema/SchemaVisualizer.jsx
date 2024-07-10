import React, { useCallback, useEffect, useState, useRef } from 'react';
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
import { Box, Button } from '@mui/material';
import { parseSqlSchema } from '../algorithms/schema_parser';
import { schemaGenerator } from '../algorithms/schema_generator';
import { resolverGenerator } from '../algorithms/resolver_generator';
import NodeList from './NodeList';
import './schemavisualizer.scss';

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
    {data.columns.map((col, index) => (
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

const SchemaVisualizer = ({ sqlContents, handleUploadBtn }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [focusMode, setFocusMode] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

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

  // const wholeView = useCallback(() => {
  //   setFocusMode(false);
  //   setSelectedNode(null);
  //   setNodes((nds) =>
  //     nds.map((node) => ({
  //       ...node,
  //       selected: false,
  //     }))
  //   );
  //   setEdges((eds) =>
  //     eds.map((edge) => ({
  //       ...edge,
  //       data: {
  //         ...edge.data,
  //         hidden: false,
  //       },
  //     }))
  //   );
  //   if (reactFlowInstance) {
  //     reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: true });
  //   }
  // }, [setNodes, setEdges, reactFlowInstance]);

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
          columns: newNode.fields.map((field) => ({
            name: field.name,
            type: field.type,
            required: field.required,
          })),
        },
      };

      setNodes((nds) => [...nds, newTableNode]);
    },
    [nodes, reactFlowInstance, setNodes]
  );

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
                  columns: updatedNode.fields.map((field) => ({
                    name: field.name,
                    type: field.type,
                    required: field.required,
                  })),
                },
              }
            : node
        )
      );
    },
    [setNodes]
  );

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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 200px)',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', height: 'calc(100% - 60px)' }}>
        <NodeList
          tables={nodes}
          onSelectTable={selectNode}
          onDeleteTable={deleteNode}
          onAddNode={addNode}
          onEditNode={editNode}
          selectedTableId={selectedNode}
        />
        <ReactFlowProvider>
          <Box
            sx={{
              flexGrow: 1,
              height: '100%',
              border: '1px solid #333',
              background: '#1a1a1a',
            }}
            ref={reactFlowWrapper}
          >
            <div className='graph-btn-container'>
              <button className='btn-generate btn-graph'>Generate</button>
              <button className='btn-save btn-graph'>Save</button>
            </div>

            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              style={{ background: '#1a1a1a' }}
              onNodeClick={(event, node) => selectNode(node.id)}
              onInit={setReactFlowInstance}
            >
              <Background color='#333' gap={16} />
              <Controls
                style={{ background: '#333', color: '#fff', border: 'none' }}
              />
              <MiniMap
                style={{ background: '#333', maskColor: '#666' }}
                nodeColor='#666'
              />
            </ReactFlow>
          </Box>
        </ReactFlowProvider>
      </Box>
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          height: "60px",
        }}
      >
        <Button variant="contained" onClick={wholeView} disabled={!focusMode}>
          Whole View
        </Button>
      </Box> */}
    </Box>
  );
};

export default SchemaVisualizer;
