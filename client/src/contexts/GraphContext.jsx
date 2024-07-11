import { createContext, useContext } from 'react';

export const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
    const [ graphName, setGraphName ] = useState(undefined);
    const [ graphId, setGraphId] = useState(undefined);
    
    console.log('Graph Context variables initialized to undefined');

    return (
        <GraphContext.Provider value={{ graphName, graphId }}>
            { children }
        </GraphContext.Provider>
    )
}

export const useGraphContext = () => {
    return useContext(GraphContext);
}