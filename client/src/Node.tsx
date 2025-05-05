import React from 'react';
import Graph from 'react-graph-vis';
//https://www.npmjs.com/package/react-graph-vis
const Node: React.FC = () => {
  const graph = {

    nodes: [
      { id: 1, label: 'Calc 2 HW'},
      { id: 2, label: 'Page 1'},
      { id: 3, label: 'Page 2'},
      { id: 4, label: 'Page 3'},
      { id: 5, label: 'Page 4'}
    ],

    edges: [
      { from: 2, to: 1 },
      { from: 3, to: 1 },
      { from: 4, to: 1 },
      { from: 5, to: 1 },
      { from: 2, to: 3 } //Need to do page 1 before 2
    ]

  };

  const options = {
    height: '500px'
  };

  return <Graph graph={graph} options={options}/>;
};

export default Node;