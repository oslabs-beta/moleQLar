import React, { createContext, useContext, useState } from 'react';

export const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
    const [ graphName, setGraphName ] = useState('');
    const [ graphId, setGraphId] = useState(null);
    
    // console.log('Graph Context variables initialized to undefined');

    return (
        <GraphContext.Provider value={{ graphName, setGraphName, graphId, setGraphId }}>
            { children }
        </GraphContext.Provider>
    )
}

export const useGraphContext = () => {
    return useContext(GraphContext);
}