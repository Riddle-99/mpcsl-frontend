import React from 'react';
import { List, Tooltip, Col, Row } from 'antd';
import { ID3GraphNode } from '../../../types/graphTypes';

import './ExternalFactorsList.scss';
import { EditOutlined } from '@ant-design/icons';

export interface IExternalFactorNode extends ID3GraphNode {
  edited: boolean;
}

export const ExternalFactorList = (props: {
  externalFactorsNodes: IExternalFactorNode[];
  onExternalFactorClick: (nodeID: string) => void;
}) => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        overflow: 'hidden',
        overflowY: 'scroll'
      }}
    >
      <List
        size="small"
        header={
          <div style={{ padding: '14px', fontWeight: 'bold' }}>
            External Factors
          </div>
        }
        dataSource={props.externalFactorsNodes}
        renderItem={(item: IExternalFactorNode) => (
          <Tooltip
            placement="topLeft"
            title={item.label}
            overlayStyle={{ paddingLeft: '4px' }}
          >
            <div
              onClick={() => {
                props.onExternalFactorClick(item.id);
              }}
              className="external-factor-list-item"
            >
              <List.Item key={item.id} style={{ paddingLeft: '14px' }}>
                <div style={{ width: '100%' }}>
                  <Row justify="space-around" gutter={12}>
                    <Col span={10}>{item.label}</Col>
                    <Col span={2}>
                      {item.edited ? <EditOutlined type="edit" /> : null}
                    </Col>
                  </Row>
                </div>
              </List.Item>
            </div>
          </Tooltip>
        )}
      />
    </div>
  );
};
