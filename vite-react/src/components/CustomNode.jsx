import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import styled from '@emotion/styled';

// CustomNode: ReactFlow node component for displaying a node with title, tags, color, and size.
// Used as the custom node type in the node canvas.

const NodeContainer = styled.div`
  padding: 10px;
  border-radius: 5px;
  background: ${props => props.color || '#fff'};
  border: 1px solid #ddd;
  width: ${props => props.size || 200}px;
  height: ${props => props.size || 200}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  text-align: center;
`;

const Tags = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: #e0e0e0;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
`;

const CustomNode = ({ data }) => {
  return (
    <NodeContainer color={data.color} size={data.size}>
      <Handle type="target" position={Position.Top} />
      <Title>{data.title}</Title>
      {data.tags && data.tags.length > 0 && (
        <Tags>
          {data.tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </Tags>
      )}
      <Handle type="source" position={Position.Bottom} />
    </NodeContainer>
  );
};

export default memo(CustomNode); 