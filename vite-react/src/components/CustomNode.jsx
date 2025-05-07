import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import styled from '@emotion/styled';

const NodeContainer = styled.div`
  padding: 10px;
  border-radius: 5px;
  background: ${props => props.color || '#fff'};
  border: 1px solid #ddd;
  width: ${props => props.size || 200}px;
`;

const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
`;

const Description = styled.p`
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
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
      {data.description && <Description>{data.description}</Description>}
      
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