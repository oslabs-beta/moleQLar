import axios from 'axios';
import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useGraphContext } from '../../contexts/GraphContext';
import GraphCard from '../GraphCard/GraphCard';
import addGraph from '../../assets/logos/addGraph.png';
import './dashboardgrid.scss';

// Defining Dashboard Grid upon specific user's graph list
const DashboardGrid = ({ handleModalOpen, handleModalClose }) => {
    const { graphList, setGraphList } = useGraphContext();
    const { username, userId } = useAuth();

    // fetch user's graphList
    useEffect(() => {
        const fetchGraphList = async () => {
            // define request header and payload
            const config = {
                headers: { authorization: localStorage.getItem('token') }
            };
            try {
                const response = await axios.get(`/api/graph/${userId}`, config);
                // success
                // console.log('graphList response:', response);
                setGraphList(response.data.graphList);
            } catch(err) {
                if (err.reponse) {
                    console.log('Failed to fetch graphList. Error response:', err.response);
                    console.log('Failed to fetch graphList. Error status:', err.status);
                } else if (err.request) {
                    console.log('Error request:', err.request);
                } else {
                    console.log('Error message:', err.message);
                }
            }
        }
        fetchGraphList();
        return;
    }, [])

    const graphCards = graphList.map((graph) => {
        return <GraphCard key={graph.graph_id} graphId={graph.graph_id} graphName={graph.graph_name}></GraphCard>
    })
    // JSX to define our Dashboard Grid div
    return (
        <div className="dashboard-grid">
            {/* <div className="add-graph-section">
                <button className="add-graph-button" onClick={handleModalOpen}>
                    <img src={addGraph} alt="Add Graph" />        
                </button>
                <p>Click here to create a new project</p>
            </div> */}
            <div className='new-graph-card graph-card' onClick={handleModalOpen}>+</div>
            {graphCards}
        </div>
    )
}

export default DashboardGrid