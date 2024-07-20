import React, { createContext, useContext, useState } from 'react';

export const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
    const [ graphName, setGraphName ] = useState('');
    const [ graphId, setGraphId] = useState(null);
    const [ graphList, setGraphList ] = useState([]);

    return (
        <GraphContext.Provider value={{ graphName, setGraphName, graphId, setGraphId, graphList, setGraphList }}>
            { children }
        </GraphContext.Provider>
    )
}

export const useGraphContext = () => {
    return useContext(GraphContext);
}