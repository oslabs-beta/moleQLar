import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import './graphcard.scss'

const GraphCard = ({graphId, graphName}) => {
    const navigate = useNavigate();
    const { authState } = useAuth();

    const handleClick = () => {
        // navigate to appropriate graph
        // console.log(`navigating to /graph/${authState.userId}/${graphId}`);
        return navigate(`/graph/${authState.userId}/${graphId}`);
    }

    return (
        <div className='graph-card' onClick={() => handleClick()}>{graphName}</div>
    )
}

export default GraphCard